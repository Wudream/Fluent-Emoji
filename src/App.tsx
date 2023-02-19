import { Component, createSignal, For, onMount, createEffect } from 'solid-js';

import SelectButton from './components/SelectButton';

const pathToImage = (path) => {
    return new Promise(resolve => {
        const img = new Image(400, 400)
        img.src = path
        img.onload = () => {
            resolve(img)
        }
    })
}


const [images, setImages] = createSignal({
    head: [],
    eyes: [],
    mouth: [],
    detail: [],
})
const [selectedIndex, setSelectedIndex] = createSignal({
    head: 0,
    eyes: 0,
    eyebrows: 0,
    mouth: 0,
    detail: 0,
})

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

    const selectedImage = () => {
        return {
            head: images().head[selectedHead() + 1].default,
            eyes: images().eyes[selectedEyes() + 1].default,
            mouth: images().mouth[selectedMouth() + 1].default,
            detail: images().detail[selectedDetails() + 1].default,
        }
    }

    const loadImage = async () => {
        // head
        const headModules = await import.meta.glob('./assets/head/*.svg');
        const headValues = Object.values(headModules).map(m => m())
        const fullHeadImages = await Promise.all(headValues)
        setHeadImages(fullHeadImages)

        // eyes
        const eyesModules = await import.meta.glob('./assets/eyes/*.svg');
        const eyesValues = Object.values(eyesModules).map(m => m())
        const fullEyesImages = await Promise.all(eyesValues)
        setEyesImages(fullEyesImages)

        // mouth
        const mouthModules = await import.meta.glob('./assets/mouth/*.svg');
        const mouthValues = Object.values(mouthModules).map(m => m())
        const fullMouthImages = await Promise.all(mouthValues)
        setMouthImages(fullMouthImages)

        // details
        const detailsModules = await import.meta.glob('./assets/details/*.svg');
        const detailsValues = Object.values(detailsModules).map(m => m())
        const fullDetailsImages = await Promise.all(detailsValues)
        setDetailsImages(fullDetailsImages)

        setImages({
            head: ['', ...fullHeadImages],
            eyes: ['', ...fullEyesImages],
            mouth: ['', ...fullMouthImages],
            detail: ['', ...fullDetailsImages],
        })
        getRandom()
    }
    loadImage()

    let canvas, canvasSize = 100;

    onMount(() => {
        loadImage()
    })

    createEffect(() => {
        const headPath = selectedHeadImage()
        const eyesPath = selectedEyesImage()
        const mouthPath = selectedMouthImage()
        const detailsPath = selectedDetailsImage()
        Promise.all([pathToImage(headPath), pathToImage(eyesPath), pathToImage(mouthPath), pathToImage(detailsPath)]).then(images => {
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvasSize, canvasSize)
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvasSize, canvasSize)
            images.forEach(img => {
                ctx.drawImage(img, 0, 0, 100, 100)
            })
        })
    })

    const handClickHead = (i, idx) => {
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

    const exportImage = () => {
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${Date.now()}`
            a.click()
        })
    }


    const exportImageSVG = (blob: Blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `emoji_${Date.now()}`
        a.click()
    }

    const toSVGBlob = async () => {
        const parser = new DOMParser()
        const documents = await Promise.all(Object.values(selectedImage()).map(image => fetch(image).then(response => response.text())))
        const svg = (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                {documents.flatMap(document => [...parser.parseFromString(document, 'image/svg+xml').documentElement.childNodes])}
            </svg>
        ) as HTMLElement
        return new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    }

    return (<>
        <h1 text="2xl" border-2 font="bold">Fluent Emoji Maker</h1>

        <div mt-8 h-32  >
            <canvas ref={canvas} width={canvasSize} height={canvasSize}></canvas>
        </div>
        {/* 
        // @ts-ignore */}
        <button m-3 onclick={[getRandom]}>Random</button>
        <button onclick={() => { exportImage() }}>Export</button>
        <button ml-3 onclick={() => toSVGBlob().then(exportImageSVG)}>svgExport</button>
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


    </>)
};

export default App;