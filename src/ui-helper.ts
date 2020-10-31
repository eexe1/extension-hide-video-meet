import noVideo from "./assets/novideo.svg";
import video from "./assets/video.svg";

export const RemoveButtonSelector = "[data-tooltip*='remove' i]";
export const ActionMenuButtonSelector =
  "div[aria-label*='Show more actions for '][role='button']";
export const VideoTagSelector = "video";
export const IdHolder = "participant-id";
export const VideoControlHolder = "control";
const HideButtonIconId = "hide-video-icon";

export const videoContainerSelector = (id: String) =>
  `div[data-requested-participant-id='${id}']`;
export const setVideoImage = (element: HTMLDivElement, hidden: Boolean) => {
  const imageElement = document.createElement("img");
  imageElement.id = HideButtonIconId;
  imageElement.src = hidden ? noVideo : video;
  element.querySelector(`img[id='${HideButtonIconId}']`)?.remove();
  element.appendChild(imageElement);
};

export const getVideoContainer = (id: String) => {
  const videoContainer = document.querySelector(videoContainerSelector(id));
  if (!(videoContainer instanceof HTMLDivElement)) {
    return undefined;
  }

  return videoContainer;
};

export enum VideoControlFlag {
  HIDDEN = "hidden",
  NOT_HIDDEN = "not-hidden",
}

export const updateVideoStlye = (
  videoContainer: HTMLDivElement,
  currentVideoElement: HTMLVideoElement,
  buttonElement: HTMLDivElement
) => {
  const isHidden =
    videoContainer.getAttribute(VideoControlHolder) == VideoControlFlag.HIDDEN
      ? true
      : false;
  setVideoImage(buttonElement, isHidden);
  if (!isHidden) {
    currentVideoElement.style.display = "";
  } else {
    currentVideoElement.style.display = "none";
  }
};

export const updateHiddenAttribute = (videoContainer: HTMLDivElement) => {
  const isHidden =
    videoContainer.getAttribute(VideoControlHolder) == VideoControlFlag.HIDDEN
      ? true
      : false;
  if (isHidden) {
    videoContainer.setAttribute("control", VideoControlFlag.NOT_HIDDEN);
  } else {
    videoContainer.setAttribute("control", VideoControlFlag.HIDDEN);
  }
};

export const getVideoParent = (videoContainer: HTMLDivElement) => {
  const element = videoContainer.querySelector(VideoTagSelector);
  return element?.parentElement;
};

export const addObserver = (
  videoContainer: HTMLDivElement,
  videoParent: HTMLElement,
  buttonElement: HTMLDivElement
) => {
  // Google injects another video element when attendees turn on/off their camera
  // video is played between two elements and it causes style changes
  // observe when a new video element is added in videoParent
  new MutationObserver((mutationRecords, observer) => {
    const elements = videoContainer.querySelectorAll(VideoTagSelector);
    elements.forEach((video) => {
      if (video.readyState !== 0) {
        updateVideoStlye(videoContainer, video, buttonElement);
      }
    });
  }).observe(videoParent, {
    childList: true,
  });

  // observe when a new video is turned on/off by others, causing style change
  new MutationObserver((mutationRecords, observer) => {
    const elements = videoContainer.querySelectorAll(VideoTagSelector);
    elements.forEach((video) => {
      if (video.readyState !== 0) {
        updateVideoStlye(videoContainer, video, buttonElement);
      }
    });
  }).observe(videoParent, {
    attributes: true,
    attributeFilter: ["style"],
    subtree: true,
  });
};
