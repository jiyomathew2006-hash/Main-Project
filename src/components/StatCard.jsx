export default function StatCard({ label, value, color }) {
  const styles = {
    blue:   { bg: "#eeeae4", border: "#d9d5cf", num: "#1a1a18", label: "#6b6860" },
    green:  { bg: "#eaf0ea", border: "#c5d9c5", num: "#2a4a2a", label: "#4a6a4a" },
    red:    { bg: "#f0eaea", border: "#d9c5c5", num: "#4a2a2a", label: "#7a4a4a" },
    yellow: { bg: "#f0ede8", border: "#d9cebc", num: "#3a3020", label: "#6b6040" },
  };

  const s = styles[color] || styles.blue;

  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: "10px",
      padding: "20px 24px",
    }}>
      <p style={{
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: s.label,
        marginBottom: "8px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "40px",
        fontWeight: 300,
        color: s.num,
        lineHeight: 1,
      }}>
        {value}
      </p>
    </div>
  );
}