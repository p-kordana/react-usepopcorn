import PropTypes from "prop-types";
import { useRef } from "react";
import { useKey } from "./useKey";

export function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

Search.propTypes = {
  onQuery: PropTypes.func,
};

export function Search({ query, onQuery }) {
  const inputEl = useRef(null);

  useKey("Escape", function () {
    inputEl.current.focus();
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
export function SearchCount({ searchCount }) {
  return (
    <p className="num-results">
      Found <strong>{searchCount}</strong> results
    </p>
  );
}
