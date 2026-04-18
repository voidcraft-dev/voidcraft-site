import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  const tags = searchParams.get("tags");
  const site = searchParams.get("site") || "portfolio";

  if (title) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#0d1117",
            padding: "60px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              <span style={{ color: "#3fb950" }}>Void</span>
              <span style={{ color: "#e6edf3" }}>Craft</span>
              {site === "blog" && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#8b949e",
                    background: "#161b22",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    marginLeft: "4px",
                  }}
                >
                  BLOG
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: "#e6edf3",
                lineHeight: 1.2,
                maxWidth: "900px",
              }}
            >
              {title}
            </div>
            {tags && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {tags.split(",").slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "14px",
                      color: "#58a6ff",
                      background: "rgba(88, 166, 255, 0.1)",
                      padding: "4px 14px",
                      borderRadius: "6px",
                      border: "1px solid rgba(88, 166, 255, 0.2)",
                    }}
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontSize: "16px",
              color: "#484f58",
            }}
          >
            <span>{site === "blog" ? "voidcraft-blog.vercel.app" : "voidcraft-site.vercel.app"}</span>
            <span>AI · MCP · Desktop · Automation</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

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
            Full-Stack Developer · AI Tools · Desktop Apps
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
    { width: 1200, height: 630 }
  );
}
