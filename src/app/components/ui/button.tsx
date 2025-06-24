import styles from "./ui.module.css";

interface StyledButtonProps {
  children: React.ReactNode | String;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function StyledButton({
  children,
  onClick,
  className = "",
}: StyledButtonProps) {
  return (
    <button onClick={onClick} className={`${styles.styledbutton} ${className}`}>
      {children}
    </button>
  );
}
