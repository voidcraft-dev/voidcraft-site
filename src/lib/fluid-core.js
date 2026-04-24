/**
 * FluidSimulation — WebGL Navier-Stokes 流体模拟
 * 零依赖纯 JS，移植自 inspira-ui FluidCursor.vue
 *
 * 用法：
 *   import { FluidSimulation } from './fluid-core.js';
 *   const sim = new FluidSimulation(canvasElement, { SPLAT_FORCE: 6000 });
 *   // 销毁：sim.destroy();
 *
 * 每帧物理流程：
 *   curl → vorticity → divergence → pressure(Jacobi×N) → gradSub → advection → render
 */

// ─── 默认配置 ────────────────────────────────────────────────────────────────

const DEFAULTS = {
  SIM_RESOLUTION: 128,       // 速度场网格分辨率（降低可省 GPU）
  DYE_RESOLUTION: 1440,      // 颜色场纹理分辨率（越高越细腻）
  DENSITY_DISSIPATION: 3.5,  // 颜色消散速度（越大消失越快）
  VELOCITY_DISSIPATION: 2,   // 速度消散速度
  PRESSURE: 0.1,             // 压力系数（影响流体弹性）
  PRESSURE_ITERATIONS: 20,   // 压力 Jacobi 迭代次数（越多越精确，越慢）
  CURL: 3,                   // 旋涡增强强度
  SPLAT_RADIUS: 0.2,         // 鼠标涂抹半径（占画面比例）
  SPLAT_FORCE: 6000,         // 鼠标推力大小
  SHADING: true,             // 是否启用法线光照（流体表面起伏感）
  COLOR_UPDATE_SPEED: 10,    // 颜色切换速度
  BACK_COLOR: { r: 0, g: 0, b: 0 },
  TRANSPARENT: true,
};

// ─── WebGL 初始化 ────────────────────────────────────────────────────────────

function initWebGL(canvas) {
  const params = {
    alpha: true, depth: false, stencil: false,
    antialias: false, preserveDrawingBuffer: false,
  };
  let gl = canvas.getContext('webgl2', params);
  if (!gl) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
  if (!gl) return { gl: null, ext: null };

  const isWebGL2 = 'drawBuffers' in gl;
  let halfFloat = null, supportLinearFiltering = false;

  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float');
    supportLinearFiltering = !!gl.getExtension('OES_texture_float_linear');
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float');
    supportLinearFiltering = !!gl.getExtension('OES_texture_half_float_linear');
  }

  gl.clearColor(0, 0, 0, 1);
  const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat?.HALF_FLOAT_OES ?? 0);

  let formatRGBA, formatRG, formatR;
  if (isWebGL2) {
    formatRGBA = _getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
    formatRG   = _getSupportedFormat(gl, gl.RG16F,   gl.RG,   halfFloatTexType);
    formatR    = _getSupportedFormat(gl, gl.R16F,    gl.RED,  halfFloatTexType);
  } else {
    formatRGBA = _getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG   = _getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatR    = _getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  }

  return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
}

function _getSupportedFormat(gl, internalFormat, format, type) {
  if (!_canRenderToFormat(gl, internalFormat, format, type)) {
    if ('drawBuffers' in gl) {
      if (internalFormat === gl.R16F)  return _getSupportedFormat(gl, gl.RG16F,   gl.RG,   type);
      if (internalFormat === gl.RG16F) return _getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
    }
    return null;
  }
  return { internalFormat, format };
}

function _canRenderToFormat(gl, internalFormat, format, type) {
  const tex = gl.createTexture();
  if (!tex) return false;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
  const fbo = gl.createFramebuffer();
  if (!fbo) return false;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
}

// ─── Shader 工具 ─────────────────────────────────────────────────────────────

function _compile(gl, type, source, keywords = null) {
  const src = keywords ? keywords.map(k => `#define ${k}\n`).join('') + source : source;
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

function _link(gl, vert, frag) {
  if (!vert || !frag) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vert); gl.attachShader(prog, frag); gl.linkProgram(prog);
  return prog;
}

function _uniforms(gl, prog) {
  const out = {};
  const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(prog, i);
    if (info) out[info.name] = gl.getUniformLocation(prog, info.name);
  }
  return out;
}

function _hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return h;
}

// ─── GLProgram / Material ────────────────────────────────────────────────────

class GLProgram {
  constructor(gl, vert, frag) {
    this.gl = gl;
    this.program = _link(gl, vert, frag);
    this.uniforms = this.program ? _uniforms(gl, this.program) : {};
  }
  bind() { if (this.program) this.gl.useProgram(this.program); }
}

// Material 支持动态 keyword 编译变体（用于 SHADING 开关）
class Material {
  constructor(gl, vert, fragSrc) {
    this.gl = gl; this.vert = vert; this.fragSrc = fragSrc;
    this.programs = {}; this.activeProgram = null; this.uniforms = {};
  }
  setKeywords(keywords) {
    const hash = keywords.reduce((acc, k) => acc + _hash(k), 0);
    if (!this.programs[hash]) {
      const frag = _compile(this.gl, this.gl.FRAGMENT_SHADER, this.fragSrc, keywords);
      this.programs[hash] = _link(this.gl, this.vert, frag);
    }
    const prog = this.programs[hash];
    if (prog === this.activeProgram) return;
    if (prog) this.uniforms = _uniforms(this.gl, prog);
    this.activeProgram = prog;
  }
  bind() { if (this.activeProgram) this.gl.useProgram(this.activeProgram); }
}

// ─── 颜色工具 ────────────────────────────────────────────────────────────────

function _hsv2rgb(h, s, v) {
  const i = Math.floor(h * 6), f = h * 6 - i;
  const p = v*(1-s), q = v*(1-f*s), t = v*(1-(1-f)*s);
  return [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][i%6];
}

function _randomColor() {
  const [r, g, b] = _hsv2rgb(Math.random(), 1, 1);
  return { r: r*1.2, g: g*1.2, b: b*1.2 };
}

function _wrap(v, min, max) {
  const range = max - min;
  return range === 0 ? min : ((v - min) % range) + min;
}

// ─── FluidSimulation ─────────────────────────────────────────────────────────

export class FluidSimulation {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Partial<typeof DEFAULTS>} options
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.cfg = { ...DEFAULTS, ...options };

    this._pointer = {
      texcoordX: 0, texcoordY: 0,
      prevTexcoordX: 0, prevTexcoordY: 0,
      deltaX: 0, deltaY: 0,
      moved: false, color: _randomColor(),
    };
    this._lastTime = Date.now();
    this._colorTimer = 0;
    this._animId = null;
    this._handlers = {};

    const { gl, ext } = initWebGL(canvas);
    if (!gl) throw new Error('WebGL not supported');

    // 低端设备降级
    if (!ext.supportLinearFiltering) {
      this.cfg.DYE_RESOLUTION = 256;
      this.cfg.SHADING = false;
    }

    this.gl = gl;
    this.ext = ext;

    this._buildShaders();
    this._initBlit();
    this._initFBOs();
    this._bindEvents();
    this._tick();
  }

  // ── GLSL Shaders ──────────────────────────────────────────────────────────

  _buildShaders() {
    const { gl, ext } = this;

    // 顶点着色器：全屏四边形 + 预计算 4 邻域 UV（供有限差分采样用）
    const vert = _compile(gl, gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    // 直接拷贝纹理（用于 FBO resize）
    const copyF = _compile(gl, gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }
    `);

    // 乘以标量（压力初始化：旧压力 × PRESSURE 系数衰减）
    const clearF = _compile(gl, gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    // 最终输出：可选法线光照（#ifdef SHADING 产生流体表面起伏感）
    const displayF = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uTexture; uniform vec2 texelSize;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc=texture2D(uTexture,vL).rgb, rc=texture2D(uTexture,vR).rgb,
               tc=texture2D(uTexture,vT).rgb, bc=texture2D(uTexture,vB).rgb;
          float dx=length(rc)-length(lc), dy=length(tc)-length(bc);
          vec3 n=normalize(vec3(dx,dy,length(texelSize)));
          c *= clamp(dot(n,vec3(0,0,1))+0.7, 0.7, 1.0);
        #endif
        gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
      }
    `;

    // 高斯 splat：在 point 位置注入色块 + 速度冲量
    const splatF = _compile(gl, gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uTarget;
      uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
      void main () {
        vec2 p = vUv - point; p.x *= aspectRatio;
        vec3 splat = exp(-dot(p,p)/radius) * color;
        gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
      }
    `);

    // 半拉格朗日对流：沿速度场反向追踪，把场值"拖"过去
    const advF = _compile(gl, gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uVelocity, uSource;
      uniform vec2 texelSize, dyeTexelSize; uniform float dt, dissipation;
      vec4 bilerp(sampler2D s, vec2 uv, vec2 ts) {
        vec2 st=uv/ts-0.5, i=floor(st), f=fract(st);
        return mix(
          mix(texture2D(s,(i+vec2(0.5,0.5))*ts), texture2D(s,(i+vec2(1.5,0.5))*ts), f.x),
          mix(texture2D(s,(i+vec2(0.5,1.5))*ts), texture2D(s,(i+vec2(1.5,1.5))*ts), f.x), f.y);
      }
      void main () {
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
        gl_FragColor = result / (1.0 + dissipation * dt);
      }
    `, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']);

    // 散度 ∇·v：衡量速度场的"源/汇"，不可压缩流体要求其为 0
    const divF = _compile(gl, gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity;
      void main () {
        float L=texture2D(uVelocity,vL).x, R=texture2D(uVelocity,vR).x,
              T=texture2D(uVelocity,vT).y, B=texture2D(uVelocity,vB).y;
        vec2 C=texture2D(uVelocity,vUv).xy;
        if(vL.x<0.0)L=-C.x; if(vR.x>1.0)R=-C.x;
        if(vT.y>1.0)T=-C.y; if(vB.y<0.0)B=-C.y;
        gl_FragColor = vec4(0.5*(R-L+T-B), 0.0, 0.0, 1.0);
      }
    `);

    // 旋度 ∇×v：衡量局部旋转强度（标量形式，2D 只有 z 分量）
    const curlF = _compile(gl, gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity;
      void main () {
        float L=texture2D(uVelocity,vL).y, R=texture2D(uVelocity,vR).y,
              T=texture2D(uVelocity,vT).x, B=texture2D(uVelocity,vB).x;
        gl_FragColor = vec4(0.5*(R-L-T+B), 0.0, 0.0, 1.0);
      }
    `);

    // 旋涡增强（Vorticity Confinement）：沿旋度梯度施力，让旋涡越转越猛
    const vortF = _compile(gl, gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv,vL,vR,vT,vB;
      uniform sampler2D uVelocity, uCurl; uniform float curl, dt;
      void main () {
        float L=texture2D(uCurl,vL).x, R=texture2D(uCurl,vR).x,
              T=texture2D(uCurl,vT).x, B=texture2D(uCurl,vB).x, C=texture2D(uCurl,vUv).x;
        vec2 force = 0.5*vec2(abs(T)-abs(B), abs(R)-abs(L));
        force /= length(force)+0.0001;
        force *= curl*C; force.y *= -1.0;
        vec2 vel = texture2D(uVelocity,vUv).xy + force*dt;
        gl_FragColor = vec4(clamp(vel,-1000.0,1000.0), 0.0, 1.0);
      }
    `);

    // Jacobi 迭代：逐步求解压力泊松方程 ∇²p = ∇·v
    const presF = _compile(gl, gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv,vL,vR,vT,vB;
      uniform sampler2D uPressure, uDivergence;
      void main () {
        float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x,
              T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x,
              div=texture2D(uDivergence,vUv).x;
        gl_FragColor = vec4((L+R+B+T-div)*0.25, 0.0, 0.0, 1.0);
      }
    `);

    // 梯度减法（投影步）：v = v - ∇p，让速度场满足不可压缩条件
    const gradF = _compile(gl, gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv,vL,vR,vT,vB;
      uniform sampler2D uPressure, uVelocity;
      void main () {
        float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x,
              T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
        vec2 vel = texture2D(uVelocity,vUv).xy - vec2(R-L, T-B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `);

    this._vert = vert;
    this._prog = {
      copy:       new GLProgram(gl, vert, copyF),
      clear:      new GLProgram(gl, vert, clearF),
      splat:      new GLProgram(gl, vert, splatF),
      advection:  new GLProgram(gl, vert, advF),
      divergence: new GLProgram(gl, vert, divF),
      curl:       new GLProgram(gl, vert, curlF),
      vorticity:  new GLProgram(gl, vert, vortF),
      pressure:   new GLProgram(gl, vert, presF),
      gradSub:    new GLProgram(gl, vert, gradF),
      display:    new Material(gl, vert, displayF),
    };

    const kw = this.cfg.SHADING ? ['SHADING'] : [];
    this._prog.display.setKeywords(kw);
  }

  // ── Blit（全屏四边形绘制）────────────────────────────────────────────────

  _initBlit() {
    const gl = this.gl;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
    const elem = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elem);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
  }

  _blit(target, clear = false) {
    const gl = this.gl;
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    if (clear) { gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  // ── Framebuffer Objects ───────────────────────────────────────────────────

  _makeFBO(w, h, internalFormat, format, type, param) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      texture: tex, fbo, width: w, height: h,
      texelSizeX: 1/w, texelSizeY: 1/h,
      attach(id) { gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; },
    };
  }

  // 双缓冲 FBO：read/write 各一份，每帧 swap（避免读写同一纹理）
  _makeDoubleFBO(w, h, internalFormat, format, type, param) {
    const r = this._makeFBO(w, h, internalFormat, format, type, param);
    const wr = this._makeFBO(w, h, internalFormat, format, type, param);
    return {
      width: w, height: h, texelSizeX: r.texelSizeX, texelSizeY: r.texelSizeY,
      read: r, write: wr,
      swap() { const t = this.read; this.read = this.write; this.write = t; },
    };
  }

  _resizeFBO(target, w, h, internalFormat, format, type, param) {
    const newFBO = this._makeFBO(w, h, internalFormat, format, type, param);
    const p = this._prog.copy;
    p.bind(); this.gl.uniform1i(p.uniforms.uTexture, target.attach(0));
    this._blit(newFBO); return newFBO;
  }

  _resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
    if (target.width === w && target.height === h) return target;
    target.read  = this._resizeFBO(target.read, w, h, internalFormat, format, type, param);
    target.write = this._makeFBO(w, h, internalFormat, format, type, param);
    Object.assign(target, { width: w, height: h, texelSizeX: 1/w, texelSizeY: 1/h });
    return target;
  }

  _res(resolution) {
    const gl = this.gl;
    const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
    const aspect = w > h ? w/h : h/w;
    const min = Math.round(resolution), max = Math.round(resolution * aspect);
    return w > h ? { width: max, height: min } : { width: min, height: max };
  }

  _initFBOs() {
    const { gl, ext, cfg } = this;
    const simRes = this._res(cfg.SIM_RESOLUTION);
    const dyeRes = this._res(cfg.DYE_RESOLUTION);
    const tt = ext.halfFloatTexType;
    const rgba = ext.formatRGBA, rg = ext.formatRG, r = ext.formatR;
    const fil = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    gl.disable(gl.BLEND);

    this._dye      = this._dye
      ? this._resizeDoubleFBO(this._dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, tt, fil)
      : this._makeDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, tt, fil);

    this._vel      = this._vel
      ? this._resizeDoubleFBO(this._vel, simRes.width, simRes.height, rg.internalFormat, rg.format, tt, fil)
      : this._makeDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, tt, fil);

    this._div  = this._makeFBO(simRes.width, simRes.height, r.internalFormat, r.format, tt, gl.NEAREST);
    this._curl = this._makeFBO(simRes.width, simRes.height, r.internalFormat, r.format, tt, gl.NEAREST);
    this._pres = this._makeDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, tt, gl.NEAREST);
  }

  // ── 物理步骤（每帧） ──────────────────────────────────────────────────────

  _step(dt) {
    const gl = this.gl;
    const { copy, clear, advection, divergence, curl, vorticity, pressure, gradSub } = this._prog;
    const vel = this._vel, dye = this._dye, div = this._div, cu = this._curl, pre = this._pres;

    gl.disable(gl.BLEND);

    // 1. 旋度
    curl.bind();
    gl.uniform2f(curl.uniforms.texelSize, vel.texelSizeX, vel.texelSizeY);
    gl.uniform1i(curl.uniforms.uVelocity, vel.read.attach(0));
    this._blit(cu);

    // 2. 旋涡增强（让旋涡越转越猛，产生漩涡感）
    vorticity.bind();
    gl.uniform2f(vorticity.uniforms.texelSize, vel.texelSizeX, vel.texelSizeY);
    gl.uniform1i(vorticity.uniforms.uVelocity, vel.read.attach(0));
    gl.uniform1i(vorticity.uniforms.uCurl, cu.attach(1));
    gl.uniform1f(vorticity.uniforms.curl, this.cfg.CURL);
    gl.uniform1f(vorticity.uniforms.dt, dt);
    this._blit(vel.write); vel.swap();

    // 3. 散度
    divergence.bind();
    gl.uniform2f(divergence.uniforms.texelSize, vel.texelSizeX, vel.texelSizeY);
    gl.uniform1i(divergence.uniforms.uVelocity, vel.read.attach(0));
    this._blit(div);

    // 4. 压力初始化（旧压力衰减，避免残留压力积累）
    clear.bind();
    gl.uniform1i(clear.uniforms.uTexture, pre.read.attach(0));
    gl.uniform1f(clear.uniforms.value, this.cfg.PRESSURE);
    this._blit(pre.write); pre.swap();

    // 5. 压力 Jacobi 迭代
    pressure.bind();
    gl.uniform2f(pressure.uniforms.texelSize, vel.texelSizeX, vel.texelSizeY);
    gl.uniform1i(pressure.uniforms.uDivergence, div.attach(0));
    for (let i = 0; i < this.cfg.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressure.uniforms.uPressure, pre.read.attach(1));
      this._blit(pre.write); pre.swap();
    }

    // 6. 梯度减法（投影步，保证速度场无散度）
    gradSub.bind();
    gl.uniform2f(gradSub.uniforms.texelSize, vel.texelSizeX, vel.texelSizeY);
    gl.uniform1i(gradSub.uniforms.uPressure, pre.read.attach(0));
    gl.uniform1i(gradSub.uniforms.uVelocity, vel.read.attach(1));
    this._blit(vel.write); vel.swap();

    // 7. 速度场自对流
    advection.bind();
    gl.uniform2f(advection.uniforms.texelSize, vel.texelSizeX, vel.texelSizeY);
    if (!this.ext.supportLinearFiltering)
      gl.uniform2f(advection.uniforms.dyeTexelSize, vel.texelSizeX, vel.texelSizeY);
    const velId = vel.read.attach(0);
    gl.uniform1i(advection.uniforms.uVelocity, velId);
    gl.uniform1i(advection.uniforms.uSource, velId);
    gl.uniform1f(advection.uniforms.dt, dt);
    gl.uniform1f(advection.uniforms.dissipation, this.cfg.VELOCITY_DISSIPATION);
    this._blit(vel.write); vel.swap();

    // 8. 染料对流（颜色跟着速度场走）
    if (!this.ext.supportLinearFiltering)
      gl.uniform2f(advection.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    gl.uniform1i(advection.uniforms.uVelocity, vel.read.attach(0));
    gl.uniform1i(advection.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(advection.uniforms.dissipation, this.cfg.DENSITY_DISSIPATION);
    this._blit(dye.write); dye.swap();
  }

  _draw() {
    const { gl } = this;
    const d = this._prog.display;
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    d.bind();
    if (this.cfg.SHADING && d.uniforms.texelSize)
      gl.uniform2f(d.uniforms.texelSize, 1/gl.drawingBufferWidth, 1/gl.drawingBufferHeight);
    gl.uniform1i(d.uniforms.uTexture, this._dye.read.attach(0));
    this._blit(null);
  }

  // ── 公开 API：手动注入 splat ───────────────────────────────────────────────

  /**
   * 在归一化坐标 (x, y) 处注入一个 splat
   * @param {number} x - 0~1，水平位置
   * @param {number} y - 0~1，垂直位置（0=底部）
   * @param {number} dx - 水平速度冲量
   * @param {number} dy - 垂直速度冲量
   * @param {{r,g,b}} color - 颜色（0~1）
   */
  splat(x, y, dx, dy, color) {
    const { gl, cfg } = this;
    const sp = this._prog.splat;
    const ar = this.canvas.width / this.canvas.height;
    const radius = cfg.SPLAT_RADIUS / 100 * (ar > 1 ? ar : 1);

    sp.bind();
    gl.uniform1i(sp.uniforms.uTarget, this._vel.read.attach(0));
    gl.uniform1f(sp.uniforms.aspectRatio, ar);
    gl.uniform2f(sp.uniforms.point, x, y);
    gl.uniform3f(sp.uniforms.color, dx, dy, 0);
    gl.uniform1f(sp.uniforms.radius, radius);
    this._blit(this._vel.write); this._vel.swap();

    gl.uniform1i(sp.uniforms.uTarget, this._dye.read.attach(0));
    gl.uniform3f(sp.uniforms.color, color.r, color.g, color.b);
    this._blit(this._dye.write); this._dye.swap();
  }

  _splatPointer() {
    const p = this._pointer;
    this.splat(p.texcoordX, p.texcoordY, p.deltaX * this.cfg.SPLAT_FORCE, p.deltaY * this.cfg.SPLAT_FORCE, p.color);
  }

  _clickSplat() {
    const p = this._pointer;
    const c = _randomColor(); c.r *= 10; c.g *= 10; c.b *= 10;
    this.splat(p.texcoordX, p.texcoordY, 10*(Math.random()-0.5), 30*(Math.random()-0.5), c);
  }

  // ── 主循环 ────────────────────────────────────────────────────────────────

  _resizeCanvas() {
    const pr = window.devicePixelRatio || 1;
    const w = Math.floor(this.canvas.clientWidth * pr);
    const h = Math.floor(this.canvas.clientHeight * pr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w; this.canvas.height = h; return true;
    }
    return false;
  }

  _tick() {
    const now = Date.now();
    const dt = Math.min((now - this._lastTime) / 1000, 0.016666);
    this._lastTime = now;

    if (this._resizeCanvas()) this._initFBOs();

    this._colorTimer += dt * this.cfg.COLOR_UPDATE_SPEED;
    if (this._colorTimer >= 1) {
      this._colorTimer = _wrap(this._colorTimer, 0, 1);
      this._pointer.color = _randomColor();
    }

    const p = this._pointer;
    if (p.moved) { p.moved = false; this._splatPointer(); }

    this._step(dt);
    this._draw();
    this._animId = requestAnimationFrame(() => this._tick());
  }

  // ── 事件绑定 ──────────────────────────────────────────────────────────────

  _px(v) { return Math.floor(v * (window.devicePixelRatio || 1)); }

  _bindEvents() {
    const p = this._pointer;

    const onMouseDown = e => {
      p.texcoordX = this._px(e.clientX) / this.canvas.width;
      p.texcoordY = 1 - this._px(e.clientY) / this.canvas.height;
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY;
      p.deltaX = 0; p.deltaY = 0; p.color = _randomColor();
      this._clickSplat();
    };

    const onMouseMove = e => {
      const ar = this.canvas.width / this.canvas.height;
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY;
      p.texcoordX = this._px(e.clientX) / this.canvas.width;
      p.texcoordY = 1 - this._px(e.clientY) / this.canvas.height;
      const dx = p.texcoordX - p.prevTexcoordX;
      const dy = p.texcoordY - p.prevTexcoordY;
      p.deltaX = ar < 1 ? dx * ar : dx;
      p.deltaY = ar > 1 ? dy / ar : dy;
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
    };

    const onTouchStart = e => {
      const t = e.targetTouches[0];
      p.texcoordX = this._px(t.clientX) / this.canvas.width;
      p.texcoordY = 1 - this._px(t.clientY) / this.canvas.height;
      p.color = _randomColor(); this._clickSplat();
    };

    const onTouchMove = e => {
      e.preventDefault();
      const t = e.targetTouches[0];
      const ar = this.canvas.width / this.canvas.height;
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY;
      p.texcoordX = this._px(t.clientX) / this.canvas.width;
      p.texcoordY = 1 - this._px(t.clientY) / this.canvas.height;
      const dx = p.texcoordX - p.prevTexcoordX;
      const dy = p.texcoordY - p.prevTexcoordY;
      p.deltaX = ar < 1 ? dx * ar : dx;
      p.deltaY = ar > 1 ? dy / ar : dy;
      p.moved = true;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    this._handlers = { onMouseDown, onMouseMove, onTouchStart, onTouchMove };
  }

  /** 停止模拟，移除所有事件监听 */
  destroy() {
    cancelAnimationFrame(this._animId);
    const h = this._handlers;
    window.removeEventListener('mousedown', h.onMouseDown);
    window.removeEventListener('mousemove', h.onMouseMove);
    window.removeEventListener('touchstart', h.onTouchStart);
    window.removeEventListener('touchmove', h.onTouchMove);
  }
}
