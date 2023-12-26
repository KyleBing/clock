/*****************************
 Create Date: 20231226091433
 Update Date: 20231226091436
 *****************************/

const WEEKDAY = {0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六',}
const WEEKDAY_SHORT = {0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六',}
const COLORS = [
    '#FFF',
    '#4CD964',
    '#5AC8FA',
    '#007AFF',
    '#5856D6',
    '#FF2D70',
    '#FF3B30',
    '#FF9500',
    '#FFCC00',
    '#8E8E93'
]
function padNumberWith0(num){
    return String(num).padStart(2, '0')
}

let app = new Vue({
    el: "#app",
    name: "Clock",
    data: {
        isFullScreen: false,
        isShowHelp: false,  // show help
        intervalHandle: null,

        height: 600,

        hours: 0,
        minutes: 0,
        seconds: 0,
        year: 0,
        month: 1,
        day: 1,
        weekday: '',
        weekShort: '',
        dateShort: '',
        date: '',
        dateFull: '',
        dateFullSlash: '',
        timeLabel: '',
        time: '',

        stringDate: '',
        stringTimeLabel: '',

        // config
        storageName: 'clock',
        config: {
            isShowSecond: true, // 显示秒数
            isShowDate: true, // 显示日期
            isShowToolPanel: true, // 显示工具栏
            fontSize: 180,
            colorIndex: 0,
            isShowGlassBlur: false, // 是否显示玻璃遮罩
            blur: 10, // 毛玻璃程度
        },

        colors: COLORS,
        // 时间字体大小
        fontSizeStep: 10,
    },
    mounted() {
        this.height = innerHeight

        // resize listener
        window.onresize = () => {
            this.height = innerHeight
        }

        this.getConfig()
        this.dateProcess()
        this.intervalHandle = setInterval(this.dateProcess, 1000)
        onkeydown = event => {
            console.log(event.key)
            switch (event.key){
                case 'ArrowDown'  : this.fontSizeDown()     ; break
                case 'ArrowUp'    : this.fontSizeUp()       ; break
                case 'ArrowLeft'  : this.blurMinus()        ; break
                case 'ArrowRight' : this.blurPlus()         ; break
                case 'c'          : this.switchColor()      ; break // color
                case 'd'          : this.toggleDate()       ; break // date
                case 's'          : this.toggleSecond()     ; break // second
                case 'f'          : this.switchFullScreen() ; break // full screen
                case 'h'          : this.toggleToolPanel()  ; break // tool panel
                case 'g'          : this.toggleGlass()      ; break // tool panel
            }
        }

        setTimeout(() => {
            if (!/^http:\/\/(a\.kylebing\.cn|localhost|192\.168\.\d{1,3}\.\d{1,3})/i.test(location.href)) {
                let hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?478d99033369c24a114bbc84a4cdc066";
                let s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            }
        }, 1000)
    },
    unmounted() {
        onkeydown = null
        if (this.intervalHandle){
            clearInterval(this.intervalHandle)
        }
    },
    methods: {
        showHelpInfo(){
            this.isShowHelp = true
        },
        // 切换颜色
        switchColor(){
            if (this.config.colorIndex >= COLORS.length - 1){
                this.config.colorIndex = 0
            } else {
                this.config.colorIndex = this.config.colorIndex + 1
            }
            this.saveConfig()
        },
        // 从本地获取上次设置的初始字体大小
        getConfig(){
            let configString = localStorage.getItem(this.storageName)
            if (configString){
                this.config = JSON.parse(configString)
                this.config.fontSize = this.config.fontSize || 180
            }
        },
        saveConfig(){
            localStorage.setItem(this.storageName, JSON.stringify(this.config))
        },
        toggleToolPanel(){
            this.config.isShowToolPanel = !this.config.isShowToolPanel
            this.saveConfig()
        },
        toggleGlass(){
            this.config.isShowGlassBlur = !this.config.isShowGlassBlur
            this.saveConfig()
        },
        toggleSecond(){
            this.config.isShowSecond = !this.config.isShowSecond
            this.saveConfig()
        },
        toggleDate(){
            this.config.isShowDate = !this.config.isShowDate
            this.saveConfig()
        },

        // BLUR
        blurMinus(){
            if (this.config.blur >= 1){
                this.config.blur = this.config.blur - 1
            }
            this.saveConfig()
        },
        blurPlus(){
            this.config.blur = this.config.blur + 1
            this.saveConfig()
        },

        fontSizeDown(){
            if (this.config.fontSize - this.fontSizeStep < 0 ){

            } else {
                this.config.fontSize = this.config.fontSize - this.fontSizeStep
                this.saveConfig()
            }
        },
        fontSizeUp(){
            this.config.fontSize = this.config.fontSize + this.fontSizeStep
            this.saveConfig()
        },
        dateProcess() {
            let date = new Date()
            this.year = date.getFullYear()
            this.month = date.getMonth() + 1
            this.day = date.getDate()
            this.hours = date.getHours()
            this.minutes = padNumberWith0(date.getMinutes())
            this.seconds = padNumberWith0(date.getSeconds())
            let week = date.getDay()
            let timeLabel = ''
            if (this.hours >= 23 && this.hours < 24 || this.hours <= 3 && this.hours >= 0) {
                timeLabel = '深夜'
            } else if (this.hours >= 19 && this.hours < 23) {
                timeLabel = '晚上'
            } else if (this.hours >= 14 && this.hours < 19) {
                timeLabel = '傍晚'
            } else if (this.hours >= 11 && this.hours < 14) {
                timeLabel = '中午'
            } else if (this.hours >= 6 && this.hours < 11) {
                timeLabel = '早上'
            } else if (this.hours >= 3 && this.hours < 6) {
                timeLabel = '凌晨'
            }

            this.weekday = WEEKDAY[week]
            this.weekShort = WEEKDAY_SHORT[week]
            this.dateShort = `${padNumberWith0(this.month)}/${padNumberWith0(this.day)}`
            this.date = `${padNumberWith0(this.month)}月${padNumberWith0(this.day)}日`
            this.dateFull = `${this.year}年${this.month}月${this.day}日`
            this.dateFullSlash = `${this.year}/${this.month}/${this.day}`
            this.timeLabel = timeLabel
            this.time = `${padNumberWith0(this.hours)}:${padNumberWith0(this.minutes)}`
            document.title = `时钟 ${this.time}`
        },
        switchFullScreen(){
            let element = document.documentElement
            // 判断是否已经是全屏
            // 如果是全屏，退出
            if (this.isFullScreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
                this.isFullScreen = false
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen()
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen()
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen()
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen()
                }
                this.isFullScreen = true
            }
        },
    }
})

