import "./ProgressBar.css";
export default function ProgressBar({ value=0 }) { return <div className="progress"><div style={{width:`${Math.min(100,Math.max(0,value))}%`}} /></div>; }