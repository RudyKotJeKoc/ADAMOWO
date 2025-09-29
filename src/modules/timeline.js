const TIMELINE_STAGES = [
  {
    range: [0, 0.2],
    text: "Faza 'love bombing': manipulator buduje iluzję idealnej relacji, obsypuje ofiarę uwagą i prezentami."
  },
  {
    range: [0.2, 0.4],
    text: 'Początek dewaluacji: pojawiają się pierwsze drobne uszczypliwości, krytyka i podważanie pewności siebie ofiary.'
  },
  {
    range: [0.4, 0.6],
    text: 'Eskalacja przemocy: otwarty konflikt, gaslighting i manipulacja. Ofiara traci poczucie rzeczywistości.'
  },
  {
    range: [0.6, 0.8],
    text: 'Faza odrzucenia: manipulator odsuwa się emocjonalnie, karząc ofiarę ciszą, ignorowaniem lub groźbą odejścia.'
  },
  {
    range: [0.8, 1.0],
    text: "Powrót do 'love bombing' (hoovering): manipulator wraca z obietnicami zmiany, by zacząć cykl od nowa."
  }
];

export function initializeTimelineAnimation(doc, gsapInstance, DraggablePlugin) {
  const path = doc.getElementById('infinity-path');
  const avatarD = doc.getElementById('avatar-d');
  const avatarB = doc.getElementById('avatar-b');
  const description = doc.getElementById('timeline-description');

  if (!path || !avatarD || !avatarB || !gsapInstance || !DraggablePlugin) {
    return;
  }

  function updateTimelineState(progress) {
    const normalisedProgress = (progress + 1) % 1;

    gsapInstance.set(avatarD, {
      motionPath: {
        path,
        align: path,
        alignOrigin: [0.5, 0.5],
        end: normalisedProgress
      }
    });

    gsapInstance.set(avatarB, {
      motionPath: {
        path,
        align: path,
        alignOrigin: [0.5, 0.5],
        end: (normalisedProgress + 0.5) % 1
      }
    });

    const currentStage =
      TIMELINE_STAGES.find((stage) => normalisedProgress >= stage.range[0] && normalisedProgress < stage.range[1]) ||
      TIMELINE_STAGES[0];

    if (description) {
      description.textContent = currentStage.text;
    }

    const manipulatorProgress = (normalisedProgress + 0.5) % 1;
    avatarB.classList.toggle('fire-active', manipulatorProgress > 0.25 && manipulatorProgress < 0.75);
  }

  DraggablePlugin.create([avatarD, avatarB], {
    type: 'motionPath',
    motionPath: { path, align: path },
    onDrag() {
      const progress = this.target === avatarB ? this.progress - 0.5 : this.progress;
      updateTimelineState(progress);
    }
  });

  updateTimelineState(0);
}
