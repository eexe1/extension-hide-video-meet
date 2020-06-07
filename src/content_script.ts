import {
  IdHolder,
  videoContainerSelector,
  VideoTagSelector,
  RemoveButtonSelector,
  ActionMenuButtonSelector,
  VideoHiddenHolder,
  setVideoImage,
} from "./ui-helper";

const getVideoContainer = (id: String) => {
  const videoContainer = document.querySelector(videoContainerSelector(id));
  if (!(videoContainer instanceof HTMLDivElement)) {
    return undefined;
  }

  return videoContainer;
};

const hideVideoButtonClickHandler = (event: Event) => {
  const element = event.currentTarget;
  if (element instanceof HTMLDivElement) {
    const participantId = element.getAttribute(IdHolder);
    if (!participantId) {
      return;
    }

    const videoContainer = getVideoContainer(participantId);
    if (!videoContainer) {
      return;
    }

    const videoElement = videoContainer.querySelector(VideoTagSelector);
    if (videoElement instanceof HTMLVideoElement) {
      const isHidden =
        videoContainer.getAttribute(VideoHiddenHolder) == "1" ? true : false;
      setVideoImage(element, !isHidden);
      if (isHidden) {
        videoContainer.style.display = "";
        videoElement.play();
        videoContainer.setAttribute(VideoHiddenHolder, "0");
      } else {
        videoContainer.style.display = "none";
        videoElement.pause();
        videoContainer.setAttribute(VideoHiddenHolder, "1");
      }
    }
  }
};

const setUpButton = (button: HTMLDivElement) => {
  const personContainer =
    button.parentElement?.parentElement?.parentElement?.parentElement;
  if (personContainer instanceof HTMLDivElement) {
    let hasButton = false;
    const actionContainer = personContainer.querySelector(RemoveButtonSelector)
      ?.parentElement?.parentElement;

    if (!actionContainer) {
      return;
    }

    actionContainer.childNodes.forEach((value) => {
      if (value instanceof HTMLDivElement && value.hasAttribute(IdHolder)) {
        hasButton = true;
      }
    });

    if (hasButton) {
      return;
    }

    const participantId = personContainer.getAttribute("data-participant-id");
    if (!participantId) {
      return;
    }

    const videoContainer = getVideoContainer(participantId);
    if (!videoContainer) {
      return;
    }
    const isHidden =
      videoContainer.getAttribute(VideoHiddenHolder) == "1" ? true : false;

    const hideVideoButton = document.createElement("div");
    hideVideoButton.setAttribute(IdHolder, participantId);
    setVideoImage(hideVideoButton, isHidden);
    hideVideoButton.addEventListener("click", hideVideoButtonClickHandler);
    actionContainer.appendChild(hideVideoButton);
  }
};

const actionMenuButtonClickHandler = (event: Event) => {
  const element = event.currentTarget;
  if (element instanceof HTMLDivElement) {
    // append the hide video button
    setUpButton(element);
  }
};

// observe action menu
new MutationObserver((mutationRecords, observer) => {
  Array.from(document.querySelectorAll(ActionMenuButtonSelector)).forEach(
    (element) => {
      element.addEventListener("click", actionMenuButtonClickHandler);
    }
  );
}).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
