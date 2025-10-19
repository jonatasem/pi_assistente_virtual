import "./index.scss";

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <span>Carregando...</span>
    </div>
  );
}
