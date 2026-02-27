const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="wh-tooltip">
        <p className="tooltip-title">{label}</p>
        <p style={{ color: "#3b82f6" }}>
          Orders: {payload[0].value}
        </p>
        <p style={{ color: "#10b981" }}>
          Revenue: ${payload[1].value}K
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;