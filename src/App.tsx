import { Component, createSignal, For } from 'solid-js';

import SelectButton from './components/SelectButton';

const borderStyle = {
    ["border-red"]: true,
    ["border-2"]: true,
    ["border-solid"]: true
};

const App: Component = () => {
    const [headImages, setHeadImages] = createSignal([]);
    const [eyesImages, setEyesImages] = createSignal([]);
    const [mouthImages, setMouthImages] = createSignal([]);
    const [detailsImages, setDetailsImages] = createSignal([]);
    const [selectedHead, setSelectedHead] = createSignal(0)
    const selectedHeadImage = () => headImages()[selectedHead()]?.default
    const [selectedEyes, setSelectedEyes] = createSignal(0)
    const selectedEyesImage = () => eyesImages()[selectedEyes()]?.default
    const [selectedMouth, setSelectedMouth] = createSignal(0)
    const selectedMouthImage = () => mouthImages()[selectedMouth()]?.default
    const [selectedDetails, setSelectedDetails] = createSignal(0)
    const selectedDetailsImage = () => detailsImages()[selectedDetails()]?.default

    const loadImage = async () => {
        // head
        const headModules = await import.meta.glob('./assets/head/*.png');
        const headValues = Object.values(headModules).map(m => m())
        const fullHeadImages = await Promise.all(headValues)
        setHeadImages(fullHeadImages)

        // eyes
        const eyesModules = await import.meta.glob('./assets/eyes/*.png');
        const eyesValues = Object.values(eyesModules).map(m => m())
        const fullEyesImages = await Promise.all(eyesValues)
        setEyesImages(fullEyesImages)

        // mouth
        const mouthModules = await import.meta.glob('./assets/mouth/*.png');
        const mouthValues = Object.values(mouthModules).map(m => m())
        const fullMouthImages = await Promise.all(mouthValues)
        setMouthImages(fullMouthImages)

        // details
        const detailsModules = await import.meta.glob('./assets/details/*.png');
        const detailsValues = Object.values(detailsModules).map(m => m())
        const fullDetailsImages = await Promise.all(detailsValues)
        setDetailsImages(fullDetailsImages)
    }
    loadImage()

    const handClickHead = (i) => {
        setSelectedHead(i)

    }

    const handClickEyes = (i) => {
        setSelectedEyes(i)

    }

    const handClickMouth = (i) => {
        setSelectedMouth(i)
    }

    const handClickDetails = (i) => {
        setSelectedDetails(i)
    }

    const randomInt = (min, max) => {

        console.log(Math.floor(Math.random() * (max - min + 1) + min));
        return Math.floor(Math.random() * (max - min + 1) + min)

    }

    const getRandom = () => {
        const head = randomInt(0, headImages().length - 1)
        const eyes = randomInt(0, eyesImages().length - 1)
        const mouth = randomInt(0, mouthImages().length - 1)
        const details = randomInt(0, detailsImages().length - 1)
        setSelectedHead(head)
        setSelectedEyes(eyes)
        setSelectedMouth(mouth)
        setSelectedDetails(details)
    }

    return (<>
        <h1 text="2xl" border-2 font="bold">Fluent Emoji Maker</h1>
        <h2 mt-4 text-sm font="bold">Head</h2>
        <div mt-8 flex='~ row wrap' gap-2>
            <For each={headImages()}>
                {(item, index) => (
                    <SelectButton index={index()} highlight={() => index() === selectedHead()}>
                        <img w-12 h-12 onclick={[handClickHead, index]} src={item.default} alt="" />
                    </SelectButton>
                )}
            </For>
        </div>
        <h2 mt-4 text-sm font="bold">Eyes</h2>
        <div mt-8 flex='~ row wrap' gap-2>
            <For each={eyesImages()}>
                {(item, index) => (
                    <SelectButton index={index()} highlight={() => index() === selectedEyes()}>
                        <img w-12 h-12 onclick={[handClickEyes, index]} src={item.default} alt="" />
                    </SelectButton>
                )}
            </For>
        </div>
        <h2 mt-4 text-sm font="bold">Mouth</h2>
        <div mt-8 flex='~ row  wrap' gap-2>
            <For each={mouthImages()}>
                {(item, index) => (
                    <SelectButton index={index()} highlight={() => index() === selectedMouth()}>
                        <img w-12 h-12 onclick={[handClickMouth, index]} src={item.default} alt="" />
                    </SelectButton>
                )}
            </For>
        </div>
        <h2 mt-4 text-sm font="bold">Details</h2>
        <div mt-8 flex='~ row  wrap' gap-2>
            <For each={detailsImages()}>
                {(item, index) => (
                    <SelectButton index={index()} highlight={() => index() === selectedDetails()}>
                        <img w-12 h-12 onclick={[handClickDetails, index]} src={item.default} alt="" />
                    </SelectButton>
                )}
            </For>
        </div>

        <div mt-8 h-32 border-red border-solid border-2 >
            <img absolute w-24 h-24 src={selectedHeadImage()} alt="" />
            <img absolute w-24 h-24 src={selectedEyesImage()} alt="" />
            <img absolute w-24 h-24 src={selectedMouthImage()} alt="" />
            <img absolute w-24 h-24 src={selectedDetailsImage()} alt="" />
        </div>
        {/* 
        // @ts-ignore */}
        <button onclick={[getRandom]}>Random</button>
    </>)
};

export default App;