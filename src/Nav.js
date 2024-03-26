import PropTypes from "prop-types";

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
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onQuery(e.target.value)}
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
