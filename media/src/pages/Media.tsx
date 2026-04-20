import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image,
  Video,
  ExternalLink,
  LogOut,
  Search,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { apiFetch } from "../helpers/apiFetch";

interface MediaItem {
  mid: number;
  type: "image" | "video";
  filename: string;
  url: string;
  size: number;
  created_at: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Media() {
  const navigate = useNavigate();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("https://api.properform.app/media");
      if (!res.ok) throw new Error("Failed to load media.");
      const data = await res.json();
      setMedia(data.media ?? []);
    } catch {
      setError("Could not load media. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError("");
    try {
      const res = await apiFetch(
        `https://api.properform.app/media/${deleteTarget.mid}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) throw new Error("Failed to delete media.");

      setMedia((prev) => prev.filter((m) => m.mid !== deleteTarget.mid));
      setDeleteTarget(null);
    } catch {
      setError("Could not delete media. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = media.filter((m) => {
    const matchesSearch = m.filename
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "all" || m.type === filter;
    return matchesSearch && matchesFilter;
  });

  const images = media.filter((m) => m.type === "image").length;
  const videos = media.filter((m) => m.type === "video").length;

  return (
    <div style={{ minHeight: "100vh", background: "#08090a" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="pf-dot" />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              ProPerform
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 4px" }}>
              /
            </span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              Media
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "6px 12px",
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(239,68,68,0.9)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {[
            {
              label: "Total",
              value: media.length,
              color: "rgba(255,255,255,0.7)",
            },
            { label: "Images", value: images, color: "rgba(96,165,250,0.9)" },
            { label: "Videos", value: videos, color: "rgba(192,132,252,0.9)" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "14px 20px",
                minWidth: 100,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 600, color: stat.color }}>
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.25)",
              }}
            />
            <input
              type="text"
              placeholder="Search by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: 40,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                paddingLeft: 36,
                paddingRight: 14,
                color: "#fff",
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
                outline: "none",
              }}
            />
          </div>

          {/* Filter tabs */}
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10,
              padding: 4,
            }}
          >
            {(["all", "image", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 7,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: filter === f ? "#1f3a8a" : "transparent",
                  color: filter === f ? "#fff" : "rgba(255,255,255,0.4)",
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchMedia}
            style={{
              height: 40,
              width: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 80,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                border: "2px solid rgba(255,255,255,0.1)",
                borderTopColor: "#1f3a8a",
                borderRadius: "50%",
                animation: "spin 0.65s linear infinite",
              }}
            />
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "rgba(239,68,68,0.7)",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "rgba(255,255,255,0.2)",
              fontSize: 14,
            }}
          >
            No media found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {filtered.map((item) => (
              <MediaCard
                key={item.mid}
                item={item}
                onRequestDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 14,
              border: "1px solid rgba(239,68,68,0.35)",
              background: "rgba(15,16,20,0.96)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
                Delete media?
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            </div>

            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.65)",
                marginBottom: 16,
                lineHeight: 1.45,
              }}
            >
              This action cannot be undone.
              <div
                style={{
                  marginTop: 8,
                  color: "rgba(255,255,255,0.85)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {deleteTarget.filename}
              </div>
            </div>

            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                style={{
                  height: 36,
                  padding: "0 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  height: 36,
                  padding: "0 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(239,68,68,0.45)",
                  background: "rgba(239,68,68,0.2)",
                  color: "rgba(254,226,226,0.95)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function MediaCard({
  item,
  onRequestDelete,
}: {
  item: MediaItem;
  onRequestDelete: (item: MediaItem) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isImage = item.type === "image";

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(31,58,138,0.5)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14,
        overflow: "hidden",
        textDecoration: "none",
        transition: "border 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
        cursor: "pointer",
      }}
    >
      {/* Preview */}
      <div
        style={{
          height: 140,
          background: "rgba(255,255,255,0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isImage ? (
          <img
            src={item.url}
            alt={item.filename}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s, filter 0.25s",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              filter: hovered ? "blur(4px) brightness(0.65)" : "none",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget
                .parentElement!.querySelector(".fallback")!
                .removeAttribute("style");
            }}
          />
        ) : null}
        <div
          className="fallback"
          style={{
            display: isImage ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            transition: "filter 0.25s",
            filter: hovered ? "blur(3px) brightness(0.75)" : "none",
          }}
        >
          {isImage ? (
            <Image size={28} color="rgba(255,255,255,0.15)" />
          ) : (
            <Video size={28} color="rgba(192,132,252,0.5)" />
          )}
        </div>

        {/* Hover overlay */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,12,20,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <button
              type="button"
              title="Open"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(item.url, "_blank", "noopener,noreferrer");
              }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.28)",
                background: "rgba(255,255,255,0.13)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
              }}
            >
              <ExternalLink size={14} />
            </button>

            <button
              type="button"
              title="Delete"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRequestDelete(item);
              }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1px solid rgba(239,68,68,0.45)",
                background: "rgba(239,68,68,0.24)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(254,226,226,0.95)",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}

        {/* Type badge */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: isImage
              ? "rgba(96,165,250,0.15)"
              : "rgba(192,132,252,0.15)",
            border: `1px solid ${isImage ? "rgba(96,165,250,0.3)" : "rgba(192,132,252,0.3)"}`,
            borderRadius: 6,
            padding: "2px 8px",
            fontSize: 10,
            fontWeight: 600,
            color: isImage ? "rgba(96,165,250,0.9)" : "rgba(192,132,252,0.9)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {item.type}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(255,255,255,0.8)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 4,
          }}
        >
          {item.filename}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          <span>{formatBytes(item.size)}</span>
          <span>{formatDate(item.created_at)}</span>
        </div>
      </div>
    </a>
  );
}
