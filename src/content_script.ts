import {
  IdHolder,
  VideoTagSelector,
  setVideoImage,
  VideoControlHolder,
  VideoControlFlag,
  updateVideoStlye,
  getVideoParent,
  updateHiddenAttribute,
  getVideoContainer,
  addObserver,
  PersonItemSelector,
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

const setUpButton = (personElement: HTMLDivElement) => {
  const personContainer = personElement;
  const actionContainer = personContainer.lastChild;
  if (
    personContainer instanceof HTMLDivElement &&
    actionContainer instanceof HTMLDivElement
  ) {
    let hasButton = false;

    actionContainer.childNodes.forEach((value) => {
      if (value instanceof HTMLDivElement && value.hasAttribute(IdHolder)) {
        hasButton = true;
      }
    });

    if (hasButton) {
      // console.log("already has button");
      return;
    }

    const participantId = personContainer.getAttribute("data-participant-id");
    if (!participantId) {
      // console.log("Unable to find participant id");
      return;
    }

    const videoContainer = getVideoContainer(participantId);
    if (!videoContainer) {
      // console.log("Unable to find video input");
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
      // console.log("Unable to find video input");
      return;
    }

    const isHidden =
      currentVideoElement.getAttribute(VideoControlHolder) ==
      VideoControlFlag.HIDDEN
        ? true
        : false;

    const hideVideoButton = document.createElement("div");
    hideVideoButton.style.display = "flex";
    hideVideoButton.setAttribute(IdHolder, participantId);
    setVideoImage(hideVideoButton, isHidden);
    hideVideoButton.addEventListener("click", hideVideoButtonClickHandler);
    actionContainer.appendChild(hideVideoButton);
  }
};

// observe action menu
new MutationObserver((mutationRecords, observer) => {
  let personElements = document.querySelectorAll(PersonItemSelector);

  Array.from(personElements).forEach((element, index) => {
    if (index !== 0) {
      if (element instanceof HTMLDivElement) {
        // append the hide video button
        setUpButton(element);
      }
    }
  });
}).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
