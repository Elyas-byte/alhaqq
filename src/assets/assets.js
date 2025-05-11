import bell_icon from './bell.png'
import home_icon from './home.png'
import like_icon from './like.png'
import loop_icon from './loop.png'
import mic_icon from './mic.png'
import next_icon from './next.png'
import play_icon from './play.png'
import pause_icon from './pause.png'
import plays_icon from './plays.png'
import prev_icon from './prev.png'
import search_icon from './search.png'
import shuffle_icon from './shuffle.png'
import speaker_icon from './speaker.png'
import stack_icon from './stack.png'
import zoom_icon from './zoom.png'
import plus_icon from './plus.png'
import arrow_icon from './arrow.png'
import mini_player_icon from './mini-player.png'
import queue_icon from './queue.png'
import volume_icon from './volume.png'
import arrow_right from './right_arrow.png'
import arrow_left from './left_arrow.png'
import clock_icon from './clock_icon.png'
import alhaqq from './alhaqq.png'
import ilaallah from './toallah.mp3'
import toallahimg from './ilaallah.png'
import remalultufuf from './remalultufuf.jpg'
import ziyarat from './ziyarat.jpg'
import bildam3 from './bildam3.jpg'
import ayeqtel from './ayeqtel.jpg'
import allaqabum from './elleqab_um_elbenin.jpg'
import jurhulfiraq from './jurhalfiraq.jpg'
import mawoodilak from './maw3oodilak.mp3'
import maw300dilak from './maw300dilak.jpg'
import sakaitshne from './sakaitshne.mp3'
import sakaitshneimg from './sakaitshne.jpg'
import alirah from './alirah.mp3'
import alirahimg from './alirah.jpg'
import thkronee from './thkronee.mp3'
import ninwa from './ninwa.jpg'
import naslhaidaram from './naslhaidaram.mp3'
import rayatna from './rayatna.jpg'
import mamireem from './mamireem.mp3'
import mamireemimg from './mamireem.jpg'
import shahada from './shahada.jpg'
import shahdal from './shahada.mp3'
import ashoof from './ashoof.mp3'
import abdulameer from './abdulameer.jpg'
import abdulameerBanner from './ABDALAMEER.png'
import sawtulahrar from './sawtulahrar.jpg'
import karbalathawra from './karbalathawra.jpg'
import dots from './dots.png'
import plPlus from './playlistplus.png'
import mute from './mute.png'
import login from './login.png'
import logout from './logout.png'
import removefromqueue from './rm_q.png'
import rm from './remove.png'
import liked from './liked.png'

export const assets = {
    bell_icon,
    home_icon,
    like_icon,
    loop_icon,
    mic_icon,
    next_icon,
    play_icon,
    plays_icon,
    prev_icon,
    search_icon,
    shuffle_icon,
    speaker_icon,
    stack_icon,
    zoom_icon,
    plus_icon,
    arrow_icon,
    mini_player_icon,
    volume_icon,
    queue_icon,
    pause_icon,
    arrow_left,
    arrow_right,
    clock_icon,
    alhaqq,
    dots,
    plPlus,
    mute,
    login,
    logout,
    removefromqueue,
    rm,
    liked,
}

export const albumsData = [
    {
        id: 0,
        name: "إصدار رمال الطفوف",
        image: remalultufuf,
        desc: "نزار القطري",
        bgColor: "#2a1315"
    },
    {
        id: 1,
        name: "إصدار زيارات",
        image: ziyarat,
        desc: "باسم الكربلائي",
        bgColor: "#22443d"
    },
    {
        id: 2,
        name: "إصدار بالدمع تكتب",
        image: bildam3,
        desc: "نزار القطري",
        bgColor: "#742a2a"
    },
    {
        id: 3,
        name: "إصدار أيقتل",
        image: ayeqtel,
        desc: "حيدر البياتي",
        bgColor: "#443331"
    },
    {
        id: 4,
        name: "إصدار اللقب ام البنين",
        image: allaqabum,
        desc: "خضر عباس",
        bgColor: "#232022"
    },
    {
        id: 5,
        name: "إصدار جرح الفراق",
        image: jurhulfiraq,
        desc: "محمد بوجبارة",
        bgColor: "#744210"
    },
    {
        id: 6,
        name: "إصدار شهادة",
        image: shahada,
        artist: 0,
        artist2: 0,
        artist3: 0,
        desc: "عبد الأمير البلادي",
        bgColor: "#744200"
    },
    {
        id: 7,
        name: "إصدار صوت الأحرار",
        image: sawtulahrar,
        artist: 0,
        artist2: 0,
        artist3: 0,
        desc: "عبد الأمير البلادي",
        bgColor: "#442201"
    },
    {
        id: 8,
        name: "إصدار كربلاء ثورة",
        image: karbalathawra,
        artist: 0,
        artist2: 0,
        artist3: 0,
        desc: "عبد الأمير البلادي",
        bgColor: "#442201"
    },
]

export const songsData = [
    {
        id: 0,
        name: "سفرة الى الله",
        image: toallahimg,
        file: ilaallah,
        desc: "حيدر البياتي",
        duration: "17:34",
        album: "N/a",
        albumN: "شهر محرم الحرام 1444 هـ",
        lyrics: [
            { "time": "00:00.00", "text": "الى الله   سـفره الى الله" },
            { "time": "00:05.00", "text": "حسيناه   بدمنه حسيناه" },
            { "time": "00:10.00", "text": "مشيناه    دربك مشيناه .. الى الله" },
        
            { "time": "00:16.00", "text": "القــارات السبعه ضجت" },
            { "time": "00:20.00", "text": "والكربلاء حسين حجت .. الى الله" },
        
            { "time": "00:26.00", "text": "شـراع السفينه يمـشي بينــه الكربله راح" },
            { "time": "00:31.00", "text": "اعله باب المدينه سر لگينه ملتقى ارواح" },
        
            { "time": "00:38.00", "text": "سألنه الكرة الارضيه" },
            { "time": "00:42.00", "text": "منــو أهــل العزوبيه" },
            { "time": "00:46.00", "text": "الزيــاره الاربعــينيـه . تكول الشاهد" },
        
            { "time": "00:52.00", "text": "عراق حسين مـَد سفره" },
            { "time": "00:56.00", "text": "من الموصل الى البصره" },
            { "time": "01:00.00", "text": "لحد مـا توصل الحضره . عراقك واحد" },
        
            { "time": "01:06.00", "text": "الحسين جننه الحسين" },
            { "time": "01:10.00", "text": "عناوين حبنـه عنـاوين" },
            { "time": "01:14.00", "text": "مجـانين اعقل مجانين . بالحسين" },
        
            { "time": "01:20.00", "text": "نـار الكرم للضيف وجت" },
            { "time": "01:24.00", "text": "والكربلاء حسين حجت . الى الله" },
        
            { "time": "01:30.00", "text": "علمنـه بدينــه ومــن بدينه نعــرف منين" },
            { "time": "01:36.00", "text": "يموسم عشكنه بي حصدنه خير الحسين" },
        
            { "time": "01:42.00", "text": "زرعنــه بكل شبر رايه" },
            { "time": "01:46.00", "text": "حصدنه أجيال مشايه" },
            { "time": "01:50.00", "text": "قـلــيله كلــمة هــوايه . قليله هوايه" },
        
            { "time": "01:56.00", "text": "الحسبنـه تتعب عيونه" },
            { "time": "02:00.00", "text": "مـطر مـو بشر شافونه" },
            { "time": "02:04.00", "text": "عجيب شلون حسبونه . مطر مشايه" },
        
            { "time": "02:10.00", "text": "شيحسبون خلهم يحسبون" },
            { "time": "02:14.00", "text": "يزيــدون ربعــك يزيــدون" },
            { "time": "02:18.00", "text": "يتـعبـــون والله يتـعبـــون . شيحسبون" },
        
            { "time": "02:24.00", "text": "ريح العشگ بالكون عجت" },
            { "time": "02:28.00", "text": "والكــربلاء حــسين حجت . الى الله" }
          ],        
    },
    {
        id: 1,
        name: "موعود الك",
        image: maw300dilak,
        file: mawoodilak,
        desc: "سيد محمد الحسيني",
        duration: "5:13",
        album: "n/a",
        albumN: "Single",
    },
    {
        id: 2,
        name: "سقای تشنه کی دیده",
        image: sakaitshneimg,
        file: sakaitshne,
        desc: "حسن شیرازی",
        duration: "4:41",
        album: "n/a",
        albumN: "Single",
    },
    {
        id: 3,
        name: "علي راح",
        image: alirahimg,
        file: alirah,
        desc: "محمد بوجبارة",
        duration: "12:43",
        album: "n/a",
        albumN: "شهر محرم الحرام 1439 هـ",
    },
    {
        id: 4,
        name: "ذكروني",
        image: ninwa,
        file: thkronee,
        desc: "حسين حاجي",
        duration: "6:34",
        album: "n/a",
        albumN: "إصدار نينوا",
    },
    {
        id: 5,
        name: "نسل حيدرم",
        image: rayatna,
        file: naslhaidaram,
        desc: "محمد حجيرات",
        duration: "2:45",
        album: "n/a",
        albumN: "إصدار راياتنا",
    },
    {
        id: 6,
        name: "ما ميرويم",
        image: mamireemimg,
        file: mamireem,
        desc: "شيخ حسين الأكرف و حامد زمانی",
        duration: "7:10",
        album: "n/a",
        albumN: "Single",
    },
    {
        id: 7,
        name: "شهادة",
        image: shahada,
        file: shahdal,
        desc: "عبد الأمير البلادي",
        duration: "6:17",
        album: "6",
        albumN: "إصدار شهادة",
    },
    {
        id: 8,
        name: "يا يوم اشوف اعتابك",
        image: ziyarat,
        file: ashoof,
        desc: "باسم الكربلائي",
        duration: "15:22",
        album: "1",
        albumN: "إصدار زيارات",
    }
]

export const artistsData = [
    {
        id: 0,
        name: "عبد الأمير البلادي",
        picture: abdulameer,
        banner: abdulameerBanner,
        color: "#590000",
        albums: 36,
        followers: "14k"
    }
]