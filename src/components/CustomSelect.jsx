import { useState, useRef, useEffect } from "react";

export default function CustomSelect({ name, value, onChange, options, placeholder, required }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(val) {
    onChange({ target: { name, value: val } });
    setOpen(false);
  }

  const selected = options.find((o) => o.value === value);

  return (
    <>
      <style>{`
        .cs-wrap { position: relative; width: 100%; }

        .cs-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 16px;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
          transition: border-color 0.15s, box-shadow 0.15s;
          user-select: none;
        }

        .cs-trigger:focus { outline: none; }

        .cs-trigger.open,
        .cs-trigger:focus-visible {
          border-color: #94a3b8;
          box-shadow: 0 0 0 3px rgba(148,163,184,0.25);
        }

        .cs-trigger-text {
          font-size: 14px;
          color: #1e293b;
          font-weight: 500;
        }

        .cs-trigger-text.placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .cs-arrow {
          width: 16px;
          height: 16px;
          color: #94a3b8;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .cs-arrow.open { transform: rotate(180deg); }

        .cs-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          z-index: 50;
          overflow: hidden;
          animation: cs-fade-in 0.12s ease;
        }

        @keyframes cs-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cs-list {
          max-height: 200px;
          overflow-y: auto;
          padding: 4px;
        }

        .cs-list::-webkit-scrollbar { width: 5px; }
        .cs-list::-webkit-scrollbar-track { background: transparent; }
        .cs-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .cs-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        .cs-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: 6px;
          font-size: 13.5px;
          color: #334155;
          cursor: pointer;
          transition: background 0.1s;
        }

        .cs-option:hover { background: #f1f5f9; }

        .cs-option.selected {
          background: #1e293b;
          color: #fff;
          font-weight: 500;
        }

        .cs-option.selected:hover { background: #0f172a; }

        .cs-check {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          opacity: 0.8;
        }
      `}</style>

      <div className="cs-wrap" ref={ref}>
        <input
          type="text"
          name={name}
          value={value}
          required={required}
          readOnly
          tabIndex={-1}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
        />

        <button
          type="button"
          className={`cs-trigger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span className={`cs-trigger-text ${!selected ? "placeholder" : ""}`}>
            {selected ? selected.label : placeholder}
          </span>
          <svg
            className={`cs-arrow ${open ? "open" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="cs-dropdown">
            <div className="cs-list">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  className={`cs-option ${value === opt.value ? "selected" : ""}`}
                  onClick={() => select(opt.value)}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && (
                    <svg className="cs-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}