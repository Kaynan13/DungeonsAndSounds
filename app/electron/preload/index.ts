function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true)
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true)
                }
            })
        }
    })
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find(e => e === child)) {
            return parent.appendChild(child)
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find(e => e === child)) {
            return parent.removeChild(child)
        }
    },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
    const className = `loaders-css__square-spin`
    const styleContent = `
@keyframes square-spin {
    0% { transform: scale(1); }  
    100% { transform: scale(1.2); }
}

@keyframes text-appear {
    0% { transform: translate(0, 100%); }  
    100% { transform: translate(0, 0); }
}

.${className} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.${className} > .app-logo {
  animation-fill-mode: both;
  width: 100px;
  height: 100px;
  background-image: url(https://dungeons-and-sounds.vercel.app/Content/img/DS-Logo.png);
  background-size: contain;
  animation: square-spin 1s ease infinite alternate-reverse;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
  z-index: 9;
}

.app-title-container{
    width: 250px;
    color: #ef3737;        
    font-family: sans-serif;
    font-weight: bold;        
    font-size: 30px;
    letter-spacing: 1px;
    overflow: hidden;
    animation: square-spin 1s ease infinite alternate-reverse;
}

.app-title-container img{
    width: 100%;
}

.title-text{
    display: block;
    animation: text-appear 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.5s;
}
`
    const oStyle = document.createElement('style')
    const oDiv = document.createElement('div')

    oStyle.id = 'app-loading-style'
    oStyle.innerHTML = styleContent
    oDiv.className = 'app-loading-wrap'
    oDiv.innerHTML = `<div class="${className}">                        
                        <div class="app-title-container">
                            <img src="https://dungeons-and-sounds.vercel.app/Content/img/DS-Logo.png" />
                        </div>
                      </div>`

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle)
            safeDOM.append(document.body, oDiv)
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle)
            safeDOM.remove(document.body, oDiv)
        },
    }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
    ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)


// ----------------------------------------------------------------------

import { createServer } from "node:http"
import fs from "fs"
import url from "url"
import ytdl from 'ytdl-core'

createServer(async (request: any, response) => {
    const headers = {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': "*",
    }

    if (request.method === "OPTIONS") {
        response.writeHead(204, headers)
        response.end()
        return;
    }

    const isDev = !__dirname.includes('resources');

    var urlData = url.parse(request.url, true);

    var videoId: string = urlData.query['id'] as string;

    if (urlData.pathname == '/getAudio') {        
        response.setHeader('Content-Disposition', `attachment; filename="${videoId}.mp3"`)

        if (videoId && videoId != 'undefined') {

            if (!isDev) {
                const mainFolder = `${__dirname.substring(0, __dirname.indexOf('resources') + 10).replaceAll(/\\/g, "/")}`;

                if (!fs.existsSync(`${mainFolder}/audios`))
                    fs.mkdirSync(`${mainFolder}/audios`)

                fs.readdir(`${mainFolder}/audios`, async (err, files) => {
                    if (err) console.error(`Unable to scan directory: ${err}`);

                    let matchFile = files.find((item: any) => item.includes(videoId)) ?? null;
                    if (matchFile) {
                        fs.createReadStream(`${mainFolder}/audios/${matchFile}`).pipe(response)
                    } else {
                        const infos: any = await ytdl.getInfo(videoId);

                        const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { format: 'mp3' as any, filter: 'audioonly', quality: 'lowest' });

                        if (infos.videoDetails.lengthSeconds <= 60)
                            await stream.pipe(fs.createWriteStream(`${mainFolder}/audios/${infos.videoDetails.videoId}.mp3`))

                        await stream.pipe(response);
                    }
                })
            } else {
                const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { format: 'mp3' as any, filter: 'audioonly', quality: 'lowest' });

                await stream.pipe(response);
            }
        } else {
            response.end();
        }
    }

    if (urlData.pathname == '/getInfos') {
        response.setHeader('Content-Type', 'application/json')
        response.writeHead(200, headers)
        const infos: any = await ytdl.getInfo(videoId) ?? null;


        response.write(JSON.stringify(infos.videoDetails))
        response.end()
    }
})
    .listen(9000, () => console.log('server is running at 9000'))
