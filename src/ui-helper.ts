import noVideo from "./assets/novideo.svg";
import video from "./assets/video.svg";

export const RemoveButtonSelector = "[data-tooltip*='Remove from meeting']";
export const ActionMenuButtonSelector =
  "div[aria-label*='Show more actions for '][role='button']";
export const VideoTagSelector = "video";
export const IdHolder = "participant-id";
export const VideoHiddenHolder = "is-hidden";
export const HideButtonIconId = "hide-video-icon";

export const videoContainerSelector = (id: String) =>
  `div[data-requested-participant-id='${id}']`;
export const setVideoImage = (element: HTMLDivElement, hidden: Boolean) => {
  const imageElement = document.createElement("img");
  imageElement.id = HideButtonIconId;
  imageElement.src = hidden ? noVideo : video;
  element.querySelector(`img[id='${HideButtonIconId}']`)?.remove();
  element.appendChild(imageElement);
};
