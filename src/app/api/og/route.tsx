import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1117",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#3fb950" }}>Void</span>
            <span style={{ color: "#e6edf3" }}>Craft</span>
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#8b949e",
              letterSpacing: "0.05em",
            }}
          >
            Full-Stack Developer &bull; AI Tools &bull; Desktop Apps
          </div>
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              gap: "12px",
            }}
          >
            {["Tauri", "Rust", "React", "TypeScript", "MCP"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "16px",
                  color: "#58a6ff",
                  background: "rgba(88, 166, 255, 0.1)",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  border: "1px solid rgba(88, 166, 255, 0.2)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "16px",
            color: "#484f58",
          }}
        >
          voidcraft-site.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
