export function TrustBadges({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="trust-badges-grid">
        <div className="trust-badge-item">
          <span className="badge-icon">🚚</span>
          <div>
            <div className="badge-title">Free Delivery</div>
            <div className="badge-sub">On all orders</div>
          </div>
        </div>
        <div className="trust-badge-item">
          <span className="badge-icon">💵</span>
          <div>
            <div className="badge-title">Cash on Delivery</div>
            <div className="badge-sub">Pay when you receive</div>
          </div>
        </div>
        <div className="trust-badge-item">
          <span className="badge-icon">↩️</span>
          <div>
            <div className="badge-title">Easy Returns</div>
            <div className="badge-sub">7-day return policy</div>
          </div>
        </div>
        <div className="trust-badge-item">
          <span className="badge-icon">🏅</span>
          <div>
            <div className="badge-title">Since 1978</div>
            <div className="badge-sub">45+ years of trust</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="trust-badges"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        flexWrap: "wrap",
        padding: "20px 16px",
        background: "#FFFDF8",
        borderTop: "1px solid rgba(201,168,76,0.15)",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "#2C2416",
        }}
      >
        <span style={{ fontSize: "20px" }}>🚚</span>
        <div>
          <strong>Free Delivery</strong>
          <br />
          <span style={{ color: "#6B5F4A", fontSize: "11px" }}>
            On all orders
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "#2C2416",
        }}
      >
        <span style={{ fontSize: "20px" }}>💵</span>
        <div>
          <strong>Cash on Delivery</strong>
          <br />
          <span style={{ color: "#6B5F4A", fontSize: "11px" }}>
            Pay when you receive
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "#2C2416",
        }}
      >
        <span style={{ fontSize: "20px" }}>↩️</span>
        <div>
          <strong>Easy Returns</strong>
          <br />
          <span style={{ color: "#6B5F4A", fontSize: "11px" }}>
            7-day return policy
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "#2C2416",
        }}
      >
        <span style={{ fontSize: "20px" }}>🏅</span>
        <div>
          <strong>Since 1978</strong>
          <br />
          <span style={{ color: "#6B5F4A", fontSize: "11px" }}>
            45+ years of trust
          </span>
        </div>
      </div>
    </div>
  );
}
