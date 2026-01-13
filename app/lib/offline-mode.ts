export function getOfflineModeState(restaurant: any, now = new Date()) {
  const paused = Boolean(restaurant?.offlineMode?.paused);
  const resumeAtRaw = restaurant?.offlineMode?.resumeAt;
  const resumeAt = resumeAtRaw ? new Date(resumeAtRaw) : null;
  const hasValidResumeAt = resumeAt instanceof Date && !Number.isNaN(resumeAt.getTime());

  if (!paused) {
    return {
      paused: false,
      resumeAt: hasValidResumeAt ? resumeAt : null,
      shouldAutoResume: false,
    };
  }

  if (hasValidResumeAt && resumeAt.getTime() <= now.getTime()) {
    return {
      paused: false,
      resumeAt,
      shouldAutoResume: true,
    };
  }

  return {
    paused: true,
    resumeAt: hasValidResumeAt ? resumeAt : null,
    shouldAutoResume: false,
  };
}
