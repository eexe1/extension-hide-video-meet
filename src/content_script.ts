import {
  IdHolder,
  videoContainerSelector,
  VideoTagSelector,
  RemoveButtonSelector,
  ActionMenuButtonSelector,
  ActionMenuButtonSelectorFallback,
  setVideoImage,
  VideoControlHolder,
  VideoControlFlag,
  updateVideoStlye,
  getVideoParent,
  updateHiddenAttribute,
  getVideoContainer,
  addObserver,
  RemoveButtonSelectorFallback,
} from "./ui-helper";

let observedParticipants: string[] = [];

const hideVideoButtonClickHandler = (event: Event) => {
  const buttonElement = event.currentTarget;
  if (buttonElement instanceof HTMLDivElement) {
    const participantId = buttonElement.getAttribute(IdHolder);
    if (!participantId) {
      return;
    }

    // contain custom attributes
    const videoContainer = getVideoContainer(participantId);
    if (!videoContainer) {
      return;
    }

    // if multiple, gets the video being played
    const elements = videoContainer.querySelectorAll(VideoTagSelector);

    // video tag's immediate parent
    const videoParent = getVideoParent(videoContainer);
    if (!videoParent) {
      return;
    }

    const isObserved = !!observedParticipants.find((p) => p === participantId);

    if (!isObserved) {
      addObserver(videoContainer, videoParent, buttonElement);
    }

    elements.forEach((video) => {
      if (video.readyState !== 0) {
        updateHiddenAttribute(videoContainer);
        updateVideoStlye(videoContainer, video, buttonElement);
      }
    });

    if (!isObserved) {
      // observer is added
      observedParticipants.push(participantId);
    }
  }
};

const setUpButton = (button: HTMLDivElement) => {
  const personContainer =
    button.parentElement?.parentElement?.parentElement?.parentElement;
  if (personContainer instanceof HTMLDivElement) {
    let hasButton = false;
    const actionContainer = (
      personContainer.querySelector(RemoveButtonSelector) ??
      personContainer.querySelector(RemoveButtonSelectorFallback)
    )?.parentElement?.parentElement;

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

    const elements = videoContainer.querySelectorAll(VideoTagSelector);
    let currentVideoElement: HTMLVideoElement | undefined;
    elements.forEach((video) => {
      if (video.readyState !== 0) {
        currentVideoElement = video;
      }
    });
    if (!currentVideoElement) {
      return;
    }

    const isHidden =
      currentVideoElement.getAttribute(VideoControlHolder) ==
      VideoControlFlag.HIDDEN
        ? true
        : false;

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
  let menuElements = document.querySelectorAll(ActionMenuButtonSelector);
  if (menuElements.length === 0) {
    menuElements = document.querySelectorAll(ActionMenuButtonSelectorFallback);
  }

  Array.from(menuElements).forEach((element) => {
    element.addEventListener("click", actionMenuButtonClickHandler);
  });
}).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
