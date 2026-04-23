interface StudyControlsProps {
  disabled?: boolean;
  onWrong: () => void;
  onRight: () => void;
}

export function StudyControls({ disabled, onWrong, onRight }: StudyControlsProps) {
  return (
    <div className="studyControls">
      <button type="button" className="controlButton wrong" onClick={onWrong} disabled={disabled}>
        Wrong
      </button>
      <button type="button" className="controlButton right" onClick={onRight} disabled={disabled}>
        Right
      </button>
    </div>
  );
}
