import React, {
    useState,
  } from "react";
  
  import {
    Eye,
    EyeOff,
    Copy,
    Star,
    Trash2,
    ShieldCheck,
    Plus,
    X,
    RefreshCw,
    Lock,
    KeyRound,
    Search,
    Settings,
    LayoutDashboard,
    Shield,
    FileText,
    BarChart3,
    WandSparkles,
    Moon,
    Sun,
  } from "lucide-react";
  
  import {
    analyzePassword,
    generatePassword,
    getInitials,
    formatDate,
  } from "./utils";
  
  export function Logo() {
    return (
      <div className="logo">
        <div className="logo-mark">
          <Lock size={20} />
        </div>
  
        <div className="logo-text">
          <strong>VaultX</strong>
          <span>Password Manager</span>
        </div>
      </div>
    );
  }
  
  export function Sidebar({
    page,
    setPage,
    categories,
    theme,
    setTheme,
  }) {
    const navigation = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "passwords",
        label: "Passwords",
        icon: KeyRound,
      },
      {
        id: "security",
        label: "Security Center",
        icon: Shield,
      },
      {
        id: "generator",
        label: "Password Generator",
        icon: WandSparkles,
      },
      {
        id: "notes",
        label: "Secure Notes",
        icon: FileText,
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
      },
    ];
  
    return (
      <aside className="sidebar">
        <Logo />
  
        <nav className="navigation">
          {navigation.map(
            ({
              id,
              label,
              icon: Icon,
            }) => (
              <button
                key={id}
                className={
                  page === id
                    ? "nav-button active"
                    : "nav-button"
                }
                onClick={() =>
                  setPage(id)
                }
              >
                <Icon size={17} />
  
                <span className="nav-label">
                  {label}
                </span>
              </button>
            )
          )}
        </nav>
  
        <div className="sidebar-bottom">
          <div className="sidebar-title">
            CATEGORIES
          </div>
  
          {categories
            .slice(0, 7)
            .map((category) => (
              <button
                className="category-link"
                key={category}
                onClick={() =>
                  setPage("passwords")
                }
              >
                {category}
              </button>
            ))}
  
          <button
            className="theme-button"
            onClick={() =>
              setTheme(
                theme === "light"
                  ? "dark"
                  : "light"
              )
            }
          >
            {theme === "light" ? (
              <>
                <Moon size={15} />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={15} />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>
    );
  }
  
  export function Header({
    title,
    subtitle,
    onAdd,
  }) {
    return (
      <header className="header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
  
        {onAdd && (
          <button
            className="primary-button"
            onClick={onAdd}
          >
            <Plus size={17} />
            Add Password
          </button>
        )}
      </header>
    );
  }
  
  export function SearchBox({
    value,
    onChange,
  }) {
    return (
      <div className="search-box">
        <Search size={17} />
  
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="Search passwords..."
        />
  
        {value && (
          <button
            className="clear-search"
            onClick={() => onChange("")}
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
  
  export function StatCard({
    label,
    value,
    description,
    type = "blue",
  }) {
    return (
      <div className="stat-card">
        <div
          className={`stat-symbol ${type}`}
        >
          <ShieldCheck size={19} />
        </div>
  
        <div>
          <span>{label}</span>
          <strong>{value}</strong>
  
          {description && (
            <small>{description}</small>
          )}
        </div>
      </div>
    );
  }
  
  export function PasswordCard({
    item,
    onDelete,
    onFavorite,
    onCopy,
    onEdit,
  }) {
    const [visible, setVisible] =
      useState(false);
  
    const strength = analyzePassword(
      item.password
    );
  
    return (
      <article className="password-card">
        <div className="password-card-top">
          <div className="platform-icon">
            {getInitials(item.platform)}
          </div>
  
          <div className="platform-data">
            <h3>{item.platform}</h3>
  
            <span>
              {item.username ||
                "No username added"}
            </span>
          </div>
  
          <button
            className={
              item.favorite
                ? "icon-button favorite active"
                : "icon-button"
            }
            onClick={() =>
              onFavorite(item.id)
            }
            title="Favorite"
          >
            <Star
              size={18}
              fill={
                item.favorite
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        </div>
  
        <div className="credential-section">
          <label>Password</label>
  
          <div className="credential-row">
            <span className="masked-password">
              {visible
                ? item.password
                : "••••••••••••••"}
            </span>
  
            <button
              className="small-icon"
              onClick={() =>
                setVisible(!visible)
              }
              title={
                visible
                  ? "Hide password"
                  : "Show password"
              }
            >
              {visible ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
  
            <button
              className="small-icon"
              onClick={() =>
                onCopy(item.password)
              }
              title="Copy password"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
  
        <div className="strength">
          <div className="strength-label">
            <span>Strength</span>
  
            <strong className={strength.level}>
              {strength.label}
            </strong>
          </div>
  
          <div className="strength-track">
            <div
              className={`strength-fill ${strength.level}`}
              style={{
                width: `${strength.percentage}%`,
              }}
            />
          </div>
        </div>
  
        <div className="password-meta">
          <span className="badge">
            {item.category}
          </span>
  
          <span>
            {formatDate(item.updatedAt)}
          </span>
        </div>
  
        <div className="card-actions">
          <button
            onClick={() => onEdit(item)}
          >
            Edit
          </button>
  
          <button
            className="delete-action"
            onClick={() =>
              onDelete(item.id)
            }
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </article>
    );
  }
  
  export function PasswordModal({
    form,
    setForm,
    onClose,
    onSave,
    editing,
  }) {
    const strength = analyzePassword(
      form.password
    );
  
    function update(field, value) {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));
    }
  
    function generate() {
      update(
        "password",
        generatePassword(20)
      );
    }
  
    return (
      <div
        className="modal-backdrop"
        onMouseDown={(event) => {
          if (
            event.target ===
            event.currentTarget
          ) {
            onClose();
          }
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <div>
              <h2>
                {editing
                  ? "Edit Password"
                  : "Add Password"}
              </h2>
  
              <p>
                Store your credential inside
                your encrypted vault.
              </p>
            </div>
  
            <button
              className="icon-button"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
  
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSave();
            }}
          >
            <div className="form-group">
              <label>Platform *</label>
  
              <input
                value={form.platform}
                onChange={(event) =>
                  update(
                    "platform",
                    event.target.value
                  )
                }
                placeholder="Instagram, GitHub, Gmail..."
                required
              />
            </div>
  
            <div className="form-group">
              <label>Password *</label>
  
              <div className="password-generator-input">
                <input
                  value={form.password}
                  onChange={(event) =>
                    update(
                      "password",
                      event.target.value
                    )
                  }
                  placeholder="Enter password"
                  required
                />
  
                <button
                  type="button"
                  onClick={generate}
                >
                  <RefreshCw size={14} />
                  Generate
                </button>
              </div>
  
              {form.password && (
                <div className="live-strength">
                  <span
                    className={
                      strength.level
                    }
                  >
                    {strength.label}
                  </span>
  
                  <div className="strength-track">
                    <div
                      className={`strength-fill ${strength.level}`}
                      style={{
                        width: `${strength.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
  
            <div className="two-column">
              <div className="form-group">
                <label>
                  Username / Email
                </label>
  
                <input
                  value={form.username}
                  onChange={(event) =>
                    update(
                      "username",
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                />
              </div>
  
              <div className="form-group">
                <label>Category</label>
  
                <select
                  value={form.category}
                  onChange={(event) =>
                    update(
                      "category",
                      event.target.value
                    )
                  }
                >
                  <option>
                    Personal
                  </option>
                  <option>
                    Social Media
                  </option>
                  <option>
                    Development
                  </option>
                  <option>
                    Work
                  </option>
                  <option>
                    Education
                  </option>
                  <option>
                    Shopping
                  </option>
                  <option>
                    Entertainment
                  </option>
                  <option>
                    Finance
                  </option>
                  <option>
                    Other
                  </option>
                </select>
              </div>
            </div>
  
            <div className="form-group">
              <label>Website</label>
  
              <input
                type="url"
                value={form.website}
                onChange={(event) =>
                  update(
                    "website",
                    event.target.value
                  )
                }
                placeholder="https://example.com"
              />
            </div>
  
            <div className="form-group">
              <label>Notes</label>
  
              <textarea
                value={form.notes}
                onChange={(event) =>
                  update(
                    "notes",
                    event.target.value
                  )
                }
                placeholder="Optional secure notes..."
              />
            </div>
  
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
              >
                Cancel
              </button>
  
              <button
                className="primary-button"
                type="submit"
              >
                <ShieldCheck size={16} />
  
                {editing
                  ? "Update Password"
                  : "Save Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export function SecurityOverview({
    stats,
  }) {
    return (
      <div className="security-overview">
        <div className="security-score">
          <div className="score-circle">
            <strong>{stats.score}</strong>
            <span>/100</span>
          </div>
  
          <div>
            <h3>Security Score</h3>
  
            <p>
              {stats.score >= 75
                ? "Your vault is in good shape."
                : "Some passwords need attention."}
            </p>
          </div>
        </div>
  
        <div className="security-items">
          <div>
            <strong>
              {stats.veryStrong}
            </strong>
            <span>Very Strong</span>
          </div>
  
          <div>
            <strong>{stats.strong}</strong>
            <span>Strong</span>
          </div>
  
          <div>
            <strong>{stats.moderate}</strong>
            <span>Moderate</span>
          </div>
  
          <div>
            <strong>{stats.weak}</strong>
            <span>Weak</span>
          </div>
  
          <div>
            <strong>{stats.reused}</strong>
            <span>Reused</span>
          </div>
        </div>
      </div>
    );
  }
  
  export function PasswordGenerator() {
    const [length, setLength] =
      useState(20);
  
    const [options, setOptions] =
      useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
      });
  
    const [password, setPassword] =
      useState(() =>
        generatePassword(20)
      );
  
    function regenerate(
      newLength = length,
      newOptions = options
    ) {
      setPassword(
        generatePassword(
          newLength,
          newOptions
        )
      );
    }
  
    function changeLength(value) {
      const newLength = Number(value);
  
      setLength(newLength);
  
      regenerate(newLength, options);
    }
  
    function toggle(key) {
      const newOptions = {
        ...options,
        [key]: !options[key],
      };
  
      setOptions(newOptions);
  
      regenerate(length, newOptions);
    }
  
    return (
      <div className="generator-page">
        <div className="generator-card">
          <div className="generator-icon">
            <WandSparkles size={24} />
          </div>
  
          <h2>Password Generator</h2>
  
          <p>
            Create strong and unique passwords
            using browser cryptography.
          </p>
  
          <div className="generated-password">
            <span>{password}</span>
  
            <button
              onClick={() =>
                navigator.clipboard
                  .writeText(password)
              }
              title="Copy"
            >
              <Copy size={17} />
            </button>
          </div>
  
          <div className="generator-control">
            <div className="control-heading">
              <span>Length</span>
              <strong>{length}</strong>
            </div>
  
            <input
              type="range"
              min="8"
              max="40"
              value={length}
              onChange={(event) =>
                changeLength(
                  event.target.value
                )
              }
            />
          </div>
  
          <div className="generator-options">
            {Object.entries(options).map(
              ([key, value]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      toggle(key)
                    }
                  />
  
                  {key
                    .charAt(0)
                    .toUpperCase() +
                    key.slice(1)}
                </label>
              )
            )}
          </div>
  
          <button
            className="primary-button full-button"
            onClick={() =>
              regenerate()
            }
          >
            <RefreshCw size={16} />
            Generate New Password
          </button>
        </div>
      </div>
    );
  }
  
  export function ConfirmModal({
    title,
    message,
    onConfirm,
    onCancel,
  }) {
    return (
      <div className="modal-backdrop">
        <div className="confirm-modal">
          <div className="danger-icon">
            <Trash2 size={21} />
          </div>
  
          <h2>{title}</h2>
  
          <p>{message}</p>
  
          <div className="modal-actions">
            <button
              className="secondary-button"
              onClick={onCancel}
            >
              Cancel
            </button>
  
            <button
              className="danger-button"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export function Toast({
    message,
    onClose,
  }) {
    if (!message) return null;
  
    return (
      <div className="toast">
        <ShieldCheck size={17} />
  
        <span>{message}</span>
  
        <button onClick={onClose}>
          <X size={14} />
        </button>
      </div>
    );
  }