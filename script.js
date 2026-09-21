document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".lifestyle-track");
  const originals = [...track.querySelectorAll(".lifestyle-card")];

  const makeClone = (item) => {
    const clone = item.cloneNode(true);
    const image = clone.querySelector("img");

    clone.setAttribute("aria-hidden", "true");
    image.alt = "";
    return clone;
  };

  originals.forEach((item) => track.append(makeClone(item)));
  [...originals].reverse().forEach((item) => track.prepend(makeClone(item)));

  const items = [...track.querySelectorAll(".lifestyle-card")];
  const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
  const itemStep = originals[0].getBoundingClientRect().width + gap;
  const setWidth = itemStep * originals.length;

  const centerItem = (item, behavior = "smooth") => {
    const centeredPosition = item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2;

    track.scrollTo({
      left: centeredPosition,
      behavior,
    });
  };

  const resetLoopPosition = () => {
    const position = track.scrollLeft;
    let nextPosition = position;

    if (position < setWidth * 0.5) {
      nextPosition = position + setWidth;
    } else if (position > setWidth * 2.5) {
      nextPosition = position - setWidth;
    }

    if (nextPosition !== position) {
      track.classList.add("is-resetting");
      track.scrollLeft = nextPosition;
      requestAnimationFrame(() => track.classList.remove("is-resetting"));
    }
  };

  carousel.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      track.scrollBy({
        left: Number(button.dataset.direction) * itemStep * 2,
        behavior: "smooth",
      });
    });
  });

  track.addEventListener("scroll", resetLoopPosition, { passive: true });

  requestAnimationFrame(() => {
    const middleOriginal = items[originals.length + Math.floor(originals.length / 2)];
    centerItem(middleOriginal, "auto");
  });
});

document.querySelectorAll(".publication-tabs").forEach((tablist) => {
  const section = tablist.closest("#publications");
  const tabs = [...tablist.querySelectorAll("[data-publication-filter]")];
  const groups = [...section.querySelectorAll("[data-publication-group]")];

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.publicationFilter;

      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      groups.forEach((group) => {
        group.hidden = filter !== "all" && group.dataset.publicationGroup !== filter;
      });
    });
  });
});
