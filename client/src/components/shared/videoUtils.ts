/**
 * Video Background Utilities
 * Handles video file filtering, selection, and transition effects
 */

export type TransitionEffect = 'fade' | 'crossfade' | 'zoom' | 'slide';

/**
 * List of available video files in the public/videos folder
 * This is a static list for performance and to avoid build-time issues
 * Update this list when new videos are added
 */
export const VIDEO_FILES: string[] = [
  '_ii_people_202602012235_1o5bf.mp4',
  '_iv_safety_202602012239_8v4en.mp4',
  '10_prompt_a_202602012235_gqyw7.mp4',
  '12_prompt_a_202602012235_5hoc5.mp4',
  '13_prompt_a_202602012236_uzh5h.mp4',
  '14_prompt_a_202602012236_m2ibq.mp4',
  '15_prompt_a_202602012236_zjfja.mp4',
  '16_prompt_a_202602012236_pfh3b.mp4',
  '17_prompt_a_202602012236_fz26w.mp4',
  '18_prompt_a_202602012236_sempt.mp4',
  '18_prompt_a_202602012236_u843x.mp4',
  '19_prompt_a_202602012236_181qh.mp4',
  '19_prompt_a_202602012236_l8toc.mp4',
  '20_prompt_a_202602012236_be82j.mp4',
  '20_prompt_a_202602012236_cx113.mp4',
  '21_prompt_a_202602012236_23oiu.mp4',
  '21_prompt_a_202602012236_rrumk.mp4',
  '21_prompt_a_202602012236_vw50b.mp4',
  '22_prompt_a_202602012236_737kj.mp4',
  '22_prompt_a_202602012237_xq9t4.mp4',
  '23_prompt_a_202602012237_f13jw.mp4',
  '24_prompt_a_202602012237_mqe7o.mp4',
  '25_prompt_a_202602012237_3b9xm.mp4',
  '26_prompt_a_202602012237_4mifh.mp4',
  '27_prompt_a_202602012237_5psjf.mp4',
  '28_prompt_a_202602012237_xlw55.mp4',
  '29_prompt_a_202602012237_ecfpl.mp4',
  '30_prompt_a_202602012237_8egua.mp4',
  '31_prompt_a_202602012237_403tg.mp4',
  '32_prompt_a_202602012237_iw9kg.mp4',
  '33_prompt_a_202602012237_miu6r.mp4',
  '33_prompt_a_202602012244_ekqyo.mp4',
  '34_prompt_a_202602012238_5279s.mp4',
  '37_prompt_a_202602012239_xftf2.mp4',
  '38_prompt_a_202602012245_zjygm.mp4',
  '39_prompt_a_202602012245_ypmuw.mp4',
  '40_prompt_a_202602012240_3nag2.mp4',
  '41_prompt_a_202602012240_1n32t.mp4',
  '41_prompt_a_202602012245_ow6ty.mp4',
  '42_prompt_a_202602012241_xxrjc.mp4',
  '43_prompt_a_202602012241_bcz7n.mp4',
  '44_prompt_a_202602012241_155tw.mp4',
  '44_prompt_a_202602012245_mtc2i.mp4',
  '45_prompt_a_202602012242_d2cqd.mp4',
  '45_prompt_a_202602012245_laud5.mp4',
  '46_prompt_a_202602012242_va8ga.mp4',
  '46_prompt_a_202602012245_510hz.mp4',
  '47_prompt_a_202602012242_fwot1.mp4',
  '48_prompt_a_202602012243_3em2j.mp4',
  '48_prompt_a_202602012245_2roue.mp4',
  '49_prompt_a_202602012243_qlg2p.mp4',
  '50_prompt_a_202602012244_7j3lr.mp4',
  '50_prompt_a_202602012245_gsmtb.mp4',
  'A_user_scrolling_202602012250_gq6kw.mp4',
  'I_scenic__202602012235_n8ntv.mp4',
  'Prompt_a_beautiful_202602012235_g0pf0.mp4',
  'Prompt_a_cinematic_202602012235_5fg15.mp4',
  'Prompt_a_cinematic_202602012235_qumuk.mp4',
  'Prompt_a_closeup_202602012235_0n248.mp4',
  'Prompt_a_hyperrealistic_202602012235_ync7h.mp4',
  'Prompt_a_sweeping_202602012235_58q8v.mp4',
  'Prompt_a_tracking_202602012235_5vdl2.mp4',
  'Prompt_a_wideangle_202602012235_jej0j.mp4',
];

/**
 * Transition effects configuration
 */
export const TRANSITION_EFFECTS: TransitionEffect[] = ['fade', 'crossfade', 'zoom', 'slide'];

/**
 * Get a random video from the available list
 * @param excludeVideos - Videos to exclude from selection
 * @returns Random video filename
 */
export function selectRandomVideo(excludeVideos: string[] = []): string {
  const availableVideos = VIDEO_FILES.filter(video => !excludeVideos.includes(video));
  if (availableVideos.length === 0) {
    return VIDEO_FILES[0];
  }
  const randomIndex = Math.floor(Math.random() * availableVideos.length);
  return availableVideos[randomIndex];
}

/**
 * Get a random transition effect
 * @returns Random transition effect type
 */
export function getTransitionEffect(): TransitionEffect {
  const randomIndex = Math.floor(Math.random() * TRANSITION_EFFECTS.length);
  return TRANSITION_EFFECTS[randomIndex];
}

/**
 * Get transition duration based on effect type
 * @param effect - Transition effect type
 * @returns Duration in milliseconds
 */
export function getTransitionDuration(effect: TransitionEffect): number {
  switch (effect) {
    case 'fade':
      return 1500;
    case 'crossfade':
      return 2000;
    case 'zoom':
      return 1500;
    case 'slide':
      return 1500;
    default:
      return 1500;
  }
}

/**
 * Get transition interval (time between transitions)
 * @returns Random interval between 8000-10000ms
 */
export function getTransitionInterval(): number {
  return Math.floor(Math.random() * (10000 - 8000 + 1)) + 8000;
}

/**
 * Get full video URL
 * @param filename - Video filename
 * @returns Full URL to the video file
 */
export function getVideoUrl(filename: string): string {
  return `/videos/${filename}`;
}

/**
 * Check if a file is a valid video file
 * @param filename - File name to check
 * @returns True if the file is a valid video
 */
export function isValidVideoFile(filename: string): boolean {
  const validExtensions = ['.mp4', '.webm'];
  return validExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

/**
 * Preload a video element
 * @param url - Video URL to preload
 * @returns Promise that resolves when video is preloaded
 */
export function preloadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    
    video.addEventListener('canplaythrough', () => {
      resolve(video);
    }, { once: true });
    
    video.addEventListener('error', () => {
      reject(new Error(`Failed to load video: ${url}`));
    }, { once: true });
    
    video.src = url;
  });
}

/**
 * Get initial animation variants based on transition effect
 * @param effect - Transition effect type
 * @returns Animation variants for framer-motion
 */
export function getTransitionVariants(effect: TransitionEffect) {
  switch (effect) {
    case 'fade':
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      };
    case 'crossfade':
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      };
    case 'zoom':
      return {
        enter: { opacity: 0, scale: 1.1 },
        center: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      };
    case 'slide':
      return {
        enter: { opacity: 0, x: 100 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
      };
    default:
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
}

/**
 * Get transition timing for framer-motion
 * @param effect - Transition effect type
 * @returns Transition timing configuration
 */
export function getTransitionTiming(effect: TransitionEffect) {
  const duration = getTransitionDuration(effect) / 1000;
  return {
    enter: { duration },
    center: { duration },
    exit: { duration },
  };
}
