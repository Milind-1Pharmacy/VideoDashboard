import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  CardMedia,
  CircularProgress,
  Grid,
  useTheme,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  ExpandLess,
  ExpandMore,
  Man2Rounded,
  SentimentSatisfied,
  TimelapseSharp,
  Woman2Rounded,
} from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import { formatTime } from "../utils/dateUtils";
import EventsTable from "./commanComponents/EventsTable";
import { StatusCard } from "./houseOfCards";
import { VideoDataInterface } from "../utils";

const videoMocks: { [key: string]: any } = {
  "1001": {
    id: "1001",
    name: "Store Recording - 30/04/2025",
    signedUrl:
      "https://1pharmacy.blob.core.windows.net/store-recordings/1000001590/event_videos/2025-04-30/20250430_215158.mp4?sp=r&st=2025-04-21T04:54:48Z&se=2025-05-30T12:54:48Z&spr=https&sv=2024-11-04&sr=c&sig=3G8E%2F8eqqbv%2F8GIIs7A%2Fo4SP4TFxEfTmOkXk6C2cn%2Bg%3D",
    startTimestamp: "2025-04-30T21:51:58Z",
    endTimestamp: "2025-04-30T22:04:51Z",
    numberOfEnquiries: 4,
    numberOfSales: 0,
    transcript:
      "0:00 (customer) : Until when this store will be open night, Till when it will be.\n0:04 (attendant) : Open till 10.  \n0:05 (customer) : O'clock that's why I was coming fast so it will be closed. You have this one for this cough and cold only.  \n0:10 (attendant) : Yeah.  \n0:12 (customer) : I came for this one. This is also for.  \n0:14 (attendant) : Cough only yes I want.  \n0:16 (customer) : This thing it would give if I would call on phone also you would bring it which number next time I will call.  \n0:29 (attendant) : Call or WhatsApp.  \n0:32 (attendant) : So Scene 55 I'll give them.  \n0:35 (customer) : OK.  \n0:35 (attendant) : This they have done no already.  \n0:37 (customer) : No already I used it for nice control for my cough.  \n0:40 (attendant) : Again, you're taking.  \n0:41 (customer) : Now from yesterday, it is cough and cold is very severe. Now. I was not able to see cough and cold. Yeah, yeah. None.  \n2:40 (customer) : So which one I should take night?  \n2:43 (attendant) : Both night only.  \n2:45 (customer) : One afternoon and one night I took last time.  \n2:48 (attendant) : Both will give you greediness. You you feel drowsy both will both 1 is antibiotic and the other one is antihistamine. But.  \n2:57 (customer) : Both I need to take yes.  \n2:59 (customer) : Already I'm feeling dizziness. I have Vertigo problem. Can I take this or not?  \n3:05 (attendant) : That antibiotic you take now which one the does he find that that 5 tablet I think.  \n3:10 (customer) : Both tablet but which one I should use because I'm having the Vertigo problem last 3-4 days. Three days I used some medicine, yesterday till morning I used it was fine again from today early morning again if it is happening.  \n3:24 (attendant) : You are a working woman.  \n3:26 (customer) : No.  \n3:27 (attendant) : Then you take 1 antibiotic and I'm having.  \n3:29 (customer) : A feeding baby also one year, nine months rest feeding. So I need to take care of him also from morning I'm feeling the same thing. I didn't take any medicine from morning still I'm feeling there now. Before this cough I came now I just left him with which one if you take.  \n3:47 (attendant) : This antibiotic you take?  \n3:48 (customer) : Normal SO.  \n3:50 (attendant) : This you take as doctor said in the afternoon but you will get sleep but you have to take rest after taking this.  \n3:58 (customer) : That will be sleepy.  \n4:00 (attendant) : This will be a little bit sleepy. This also you have to if you take immediately you will get sleepy and that kind of activity.  \n4:08 (customer) : In the afternoon and that small monitor is in the night. The last time doctor said like take one afternoon and one night, night you'll be feeling drowsy and morning the gastric tablet. Razzoty, Razzoty. Can you have razzoty also? Yeah, give me razzoty also. That is compulsory for this medicine.  \n4:26 (attendant) : If you feel, if you're taking antibiotic, if you feel gastric, then you have to take. If you don't feel not necessary, OK.  \n4:36 (customer) : Give me because I'm using it. Give 5 tablets. OK, now again.  \n5:03 (attendant) : You're not paid it, no.  \n5:04 (customer) : No, I'm not paid.  \n5:12 (attendant) : 5 not.  \n5:12 (customer) : 7.  \n5:16 (attendant) : 456 months after discount.  \n5:18 (customer) : So vertical is a common problem. It was common people.  \n5:22 (attendant) : It is common, no BP and.  \n5:26 (customer) : All nothing, everything is fine actually. What do you say this balconies sliding door will be there and that fell on?  \n5:35 (attendant) : From that day onwards.  \n5:36 (customer) : Last Saturday it fell, Friday it fell so night, midnight. Saturday midnight started playing. I was fine, more vomiting, nothing. Midnight I suddenly woke up and I was feeling this vertical problem. Giddiness was not able to walk so immediately I meant.  \n5:57 (attendant) : To not a common vertical no.  \n5:59 (attendant) : You got to hurt then.  \n6:00 (customer) : Only so I thought I'm using orthopedic medicines because of that medicines. That medicines are also drowsy. The doctor told me it will be drowsy. You will have rest in the night because you're taking care of baby also night would be nice for you. I was confused. I was taking that medicines for seven days, four days completed, another three days. So medicine problem or that one problem I was not able to understand. So it's better to go to the doctors. I went to the doctor on Saturday. He asked me to take an ENT. ENT was not available. Then he asked me to take cervical X-ray. They took cervical X-ray. Everything was common, no break damage, nothing.  \n6:36 (attendant) : Is there?  \n6:37 (customer) : But that it fell from high, low to pressure fell on my doctor said OK your orthopedic is not available. So based on this report I will give three days course. So till yesterday morning he gave me 3 days course Calpol and some medicine nerve related. I used it.  \n6:57 (customer) : It was reviewed dizziness and everything went for till yesterday morning. So again evening I went for review After three days they asked for reviews yesterday I went after said you're not feeling you're feeling well now, but still you consult ENT. I went to ENT also to everything, tested everything she told, She told that that fell no due to that pressure only. You have that problem so slowly it should go, slowly it should go. Something will be here itself. No, it will be getting disturbed, discussed. When something fails for elder people, they do some treatment, but we are younger. No, it can only automatically set, but it will takes no time. Young. Disgusting.  \n7:34 (attendant) : She told me like.  \n7:36 (customer) : That you are young, no. So no treatment you just give a hot fermentation and volume nature I have already I am already. So just apply that and give hot fermentations. OK I said and no medicines actually came back yesterday. Today morning when I woke up in morning started feel giddiness from morning now also.  \n7:57 (attendant) : I wanted to know this.  \n7:58 (attendant) : We find that you completed the course again. You're taking today or when you've taken this, I think.  \n8:06 (customer) : Last month.  \n8:07 (attendant) : Only last month, not.  \n8:08 (customer) : Recently this month only first week.  \n8:11 (attendant) : But had gap and again you got cough so that reason you're taking OK.  \n8:15 (customer) : It was very nice for me. I took for five course 5 tablets. It got relief control now again start.  \n8:26 (attendant) : Because of that medicine, that automatic medicine you're taking or that reason.  \n8:30 (customer) : That also immediately after four days that happened. You just take these three for four days.  \n8:37 (attendant) : You don't think, you don't feel any vomiting sensation or any sound?  \n8:43 (customer) : Little buzzy sound I was so yesterday I told the EMT also she said yeah, it is because of that pressure which fell. So it will take time. She did all the tests. Whatever EMT will do, She did everything. She made me walk also balancing walk. There will be.  \n8:57 (customer) : She made me everything but till today morning again it's happening. So my husband told me we'll go to urgent care so much. I'm very tired of roaming and 25 to each and every test. This started from August I think. August I took MRA, then scan, X-ray, everything that continuous.  \n9:16 (attendant) : There's no, I mean, there's no problem why you're getting it in this again and again.  \n9:20 (customer) : No, no, this shoulder best one started for me basically from there this all everything they're continuous. They're telling me to take this. That is that I'm fed up of.  \n9:33 (attendant) : Take a second doctor and.  \n9:35 (customer) : Opinion for this thyroid nodia.  \n9:51 (customer) : Opinion for this thyroid nodia.  \n9:53 (customer) : So they the doctor said normal, it's very tiny and it's not cancerous also, so no surgery is required in future after six months you take a thing scan if it increases then we'll think that time. Also it is unnecessary way to remove the land. Time of land part of time of land which produces in many things will be there. Then I got late and so they told tomorrow only you come, you join.  \n10:20 (attendant) : Like that, only they'll tell.  \n10:22 (customer) : Me, how can one day we can manage? Is it urgent? Also they're not selling anything. No, we don't tell urgent. We don't tell late. Also you should do comparison give some.  \n10:32 (attendant) : Opinion on today also I had an experience of my friend, he had some bacterial infection in his abdominal. The bus was stored in one place in abdominal and he's very active, there's no fever, nothing. He came here and immediately we have to do surgery that is for 3,00,000. So I said OK, we'll come back, we'll ask the 2nd doctor.  \n10:52 (attendant) : OK, that is near Hebbal is that doctor said and checked all the reports you have seen, they have not said any test to be done and only the previous reports only he said and he just injected that place and he said that buses all out and he gave antibiotics for Pydis that's all clear that is only for 12,000 this money for people I don't know why they are doing like that.  \n11:20 (customer) : My son no at Manana I told him he was with vomiting service thing. He immediately went in like on 17th of this month immediately joined him. They kept him for for vomiting got admitted and they thing each and every distant they did X-ray also they did that cultures everything. After four days when he recovered, then one year, nine months, I paid all.  \n11:54 (attendant) : 456.  \n12:03 (customer) : With this condition, we can't do journey now. Yeah, no, actually my husband planned tomorrow to go to Hyderabad. Tomorrow morning we should leave. But I'm having a disturbing I can't. Normally I'm not able to work. Hyderabad means minimum 8 to 10 hours of time.  \n12:21 (attendant) : Carrying a baby and.  \n12:27 (customer) : Thank you. So I should take only this one?\n",
    summary:
      "The customer visits the pharmacy late at night seeking medicine for severe cough and cold. They discuss the store's operating hours, the effects of prescribed antibiotics and antihistamines, and the customer's ongoing vertigo issues. The attendant advises on medication timing, drowsiness, and managing gastric symptoms with Razzoty. The customer shares frustrations about recurring vertigo after a recent accident, multiple medical tests, and conflicting advice from doctors. The attendant recommends seeking a second medical opinion. Sentiment remains neutral as the conversation focuses on transactional and advisory exchanges.",
    // bill
    // enq
    // demo
    events: [
      {
        timestamp: "2025-04-30T21:52:24Z", // 00:15
        billNumber: null,
        enquiries: ["Montek LC Tablet"],
        demographics: null,
      },
      {
        timestamp: "2025-04-30T21:53:45Z", // 01:45
        // billNumber: "BILL220422001",
        enquiries: ["ENQ002"],
        demographics: [["F", 28]],
      },
      {
        timestamp: "2025-04-30T21:54:01Z", // 00:15
        billNumber: null,
        enquiries: ["Alex Syp 100 ml"],
        demographics: null,
      },
      {
        timestamp: "2025-04-30T21:56:41Z", // 00:15
        billNumber: null,
        enquiries: ["RAZO D CAP 15"],
        demographics: null,
      },

      {
        timestamp: "2025-04-30T22:04:44Z", // 00:15
        billNumber: null,
        enquiries: ["Pantodac 40 mg"],
        demographics: null,
      },
    ],
  },
  "1002": {
    id: "1002",
    name: "Store Recording - 21/04/2025",
    signedUrl:
      "https://1pharmacy.blob.core.windows.net/store-recordings/1000001590/event_videos/2025-04-21/20250421_164415.mp4?sp=r&st=2025-04-21T04:54:48Z&se=2025-05-30T12:54:48Z&spr=https&sv=2024-11-04&sr=c&sig=3G8E%2F8eqqbv%2F8GIIs7A%2Fo4SP4TFxEfTmOkXk6C2cn%2Bg%3D",
    startTimestamp: "2025-04-21T16:44:15Z",
    endTimestamp: "2025-04-21T16:47:20Z",
    numberOfEnquiries: 3,
    numberOfSales: 1,
    transcript:
      "0:16 (Speaker 2): ಲು.  \n0:19 (Speaker 1): ನಿಂತಿದ್ದು.  \n0:16 (Speaker 1): ನನಗೆ ಬಾ.  \n0:21 (Speaker 2): ಬ್ಯಾಕ್ ಗೆ ಹೋಗಿ. ಕಂಟೆಂಟ್. ಇಲ್ಲ ಇಲ್ಲ ನಾನು.  \n0:35 (Speaker 1): ಬ್ಯಾಂಕಿಂಗ್ ತ. ಮಿಕ್ಕಿದಲಾಗಿದೆ.  \n1:18 (Speaker 2): ಯಾಕ್ಸೆಸ್ ಟು.  \n1:20 (Speaker 1): ಅವಳು ಮನೇಲಿ 12.  \n1:24 (Speaker 2): 12. ಪೊಲೀಸ್ ಎಲೆಕ್ಷನ್.  \n1:29 (Speaker 1): ಫೋನ್ ಮಾಡು. ಯೋ ಮ್ಯೂಸಿಕ್ ಡಿಟೇಲ್ಸ್. ಯೋ ಮ್ಯೂಸಿಕ್ ಸೆಂಟರ್ ನನಗೆ ಅದು. ಸ್ಯಾಕ್ಸನ್ ಬಂದಿಲ್ಲ ಅಂತ.  \n1:50 (Speaker 2): ಎಂಟು.  \n1:52 (Speaker 1): 11.  \n1:58 (Speaker 1): 16.  \n2:13 (Speaker 2): ತ್ರೀ ಸೆವೆನ್ ಸಿಕ್ಸ್. ಫೋನ್.  \n2:16 (Speaker 1): ಇನ್ ಟು 96 ಮ್ಯೂಸಿಕ್. ಟಿವಿ ಆರಂಭಿಸಿ. ತ್ರೀ ಸೆವೆನ್ ಸೆವೆನ್. ಸಿಮೆಂಟನ್ನು ಸೇರಿಸಿ ರುಬ್ಬಿ ಥ್ಯಾಂಕ್ಸ್.\n",
    summary: "",
    // bill
    // enq
    // demo
    events: [
      {
        timestamp: "2025-04-21T16:46:46Z", // 00:15
        billNumber: ["URM01709"],
        enquiries: null,
        demographics: null,
        orderImgUrl:
          "https://5.imimg.com/data5/SELLER/Default/2023/12/369519654/JE/LO/KB/844696/a5-size-bill-book.jpg",
      },
      {
        timestamp: "2025-04-21T16:45:32Z", // 00:15
        billNumber: null,
        enquiries: ["Unobiotics Junior"],
        demographics: null,
      },
      {
        timestamp: "2025-04-21T16:45:20Z", // 00:15
        billNumber: null,
        enquiries: ["ZINCONIA SYP 100ML"],
        demographics: null,
      },
      {
        timestamp: "2025-04-21T16:44:25Z", // 00:15
        billNumber: null,
        enquiries: ["JUNIOR LANZOL 15"],
        demographics: null,
      },
      {
        timestamp: "2025-04-21T16:45:20Z", // 01:45
        // billNumber: "BILL220422001",
        demographics: [["F", 28]],
      },
    ],
  },
  "1003": {
    id: "1003",
    name: "Store Recording - 18/04/2025",
    signedUrl:
      "https://1pharmacy.blob.core.windows.net/store-recordings/1000001590/event_videos/2025-04-18/20250418_093843.mp4?sp=r&st=2025-04-21T04:54:48Z&se=2025-05-30T12:54:48Z&spr=https&sv=2024-11-04&sr=c&sig=3G8E%2F8eqqbv%2F8GIIs7A%2Fo4SP4TFxEfTmOkXk6C2cn%2Bg%3D",
    startTimestamp: "2025-04-18T09:38:43Z",
    endTimestamp: "2025-04-18T09:41:48Z",
    numberOfEnquiries: 3,
    numberOfSales: 1,
    transcript:
      "0:02 (Speaker 1): ಯಾರು? ಅವರಿಗೆ ಬಿಟ್ಟಳು. ವಿಎಚ್ ಒಂದು.\n  0:07 (Speaker 2): ಮುಚ್ಚಿ.  \n0:16 (Speaker 1): ಪಾಸ್ ಮಾಡಿ.  \n0:20 (Speaker 2): ರು.  \n0:23 (Speaker 1): ತಿಂಗಳು. ವಿ ಜ ಯ ವಾ ಡ.  \n0:31 (Speaker 2): ಬೆಳ್ಳುಳ್ಳಿ ಸ್ವಲ್ಪ ನಿಧಾನವಾಯಿತು.  \n0:38 (Speaker 1): ಮಾಡು. ವೇದ್ಯ ರಾತ್ರಿ. ರ ವಿ ಸುಬ್ಬ ವೈದ್ಯ. ಯಾರುದು? ಪ್ರಸ್ತುತ ಒಂದು. \n 0:53 (Speaker 2): £1 ರವಿ.  \n0:56 (Speaker 1): ಪಾಲು, 1006.  \n1:02 (Speaker 1): ಆದರೆ ಸಾವಿರಾರು ಕೋಟಿ ಅನುದಾನ. ಅವಿಧೇಯ.  \n1:11 (Speaker 2): ಮಿನಿ.  \n1:16 (Speaker 1): ಹಲೋ ಇದು ಬ್ಯಾಂಕ್ 52. ಈ ತಿಂಗಳು. ಹಾಂ. 1613. ಶಾಂತವಾಗುವುದು. ಪಾಸ್ ಮಾಡಿ. ಪಾಸ್ ಮಾಡಿ. ಅದೇ. ಅದು ಮಾಡು. \n 2:28 (Speaker 2): ಈ ಲೇಖನದಲ್ಲಿ ತಿಳಿಸಲಾಗಿದೆ.  \n2:50 (Speaker 1): ಎಲ್ಲ ಹೋಗಿ ಬರೋಣ.  \n4:14 (Speaker 2): ಪ್ಲೇ ಮಾಡಿ. ಮಾಡು.  \n4:20 (Speaker 1): ನಾವು ಮಾಡಿದರು.  \n4:22 (Speaker 2): ಮಾಡಿಲ್ಲ. ಪೇಮೆಂಟ್.  \n4:25 (Speaker 1): ಮಾಡಿದ್ರೆ ಚೆಂಜ್ ಮಾಡಿ.  \n4:29 (Speaker 2): ಒಂದು.  \n4:30 (Speaker 1): 12.ರೋಣ.ವಿಕ.  \n5:02 (Speaker 2): ಕಾಫಿ. ಎಷ್ಟು?  \n5:34 (Speaker 1): 19. ವಿ.  \n5:39 (Speaker 2): ತ. ಕಷ್ಟವೋ ಜನ? ಹ್. \n 6:49 (Speaker 1): ರದ್ದುಮಾಡಿರಿ. \n 6:53 (Speaker 2): ಒಂದು.  \n6:56 (Speaker 1): ಎರಡು.  \n7:00 (Speaker 2): ನಾನು ಇಷ್ಟವಾ. ಕಸ್ಟಮರ್. ಮಾಡುತ್ತದೆ. ಇದು.\n",
    summary: "",
    // bill
    // enq
    // demo
    events: [
      {
        timestamp: "2025-04-18T09:39:34Z", // 00:15
        billNumber: ["URM01420"],
        enquiries: null,
        demographics: null,
        orderImgUrl:
          "https://5.imimg.com/data5/SELLER/Default/2023/12/369519654/JE/LO/KB/844696/a5-size-bill-book.jpg",
      },
      {
        timestamp: "2025-04-18T09:40:42Z", // 00:15
        billNumber: null,
        enquiries: ["Rashfree Cream"],
        demographics: null,
      },
      {
        timestamp: "2025-04-18T09:41:25Z", // 00:15
        billNumber: null,
        enquiries: ["TELMA 40MG TAB"],
        demographics: null,
      },
      {
        timestamp: "2025-04-18T09:40:06Z", // 00:15
        billNumber: null,
        enquiries: ["Cadbury Dairy Milk "],
        demographics: null,
      },
      {
        timestamp: "2025-04-18T09:40:42Z", // 01:45
        // billNumber: "BILL220422001",
        enquiries: ["ENQ002"],
        demographics: [["F", 46]],
      },
    ],
  },
  "1004": {
    id: "1004",
    name: "Store Recording - 28/04/2025",
    signedUrl:
      "https://1pharmacy.blob.core.windows.net/store-recordings/1000001590/event_videos/2025-04-28/20250428_194035.mp4?sp=r&st=2025-04-21T04:54:48Z&se=2025-05-30T12:54:48Z&spr=https&sv=2024-11-04&sr=c&sig=3G8E%2F8eqqbv%2F8GIIs7A%2Fo4SP4TFxEfTmOkXk6C2cn%2Bg%3D",
    startTimestamp: "2025-04-28T19:40:35Z",
    endTimestamp: "2025-04-28T19:43:43Z",
    numberOfEnquiries: 3,
    numberOfSales: 1,
    transcript:
      "0:00 (Speaker 1): ಅದು. ಝಿಂಗ್. ಮ್ಯಾಕ್ಸ್ ಟೂ. ಆಮೇಲೆ ಒಂದು ಕೋಷನ್.\n0:15 (Speaker 2): ಕಾಲದಲ್ಲಿ.\n0:16 (Speaker 1): ದ್ದು. ಆತ ಬೇರೆಯವರಿಗೆ.\n0:21 (Speaker 2): ತುಂಬಾ ಪಾರ್ಟಿಗಳು.\n0:23 (Speaker 1): ಹು. ಬೇರೆ ಅದು. ಹೌದು. ಮೋಷನ್ ಸ್ಟಿಲ್ಸ್.\n1:04 (Speaker 2): ಇದು.\n1:05 (Speaker 1): ಮೋಸ.\n1:06 (Speaker 2): ಇದು ಅಷ್ಟೇ.\n1:07 (Speaker 1): ಅಲ್ಲ ಕಾಸಿನ. ಎಂಟು. ಜಿಂಕೆ ಜಿಂಕೆಯ ತರಬೇಕು ಎಂದು.\n1:18 (Speaker 2): ಆದೇಶದಲ್ಲಿ.\n1:20 (Speaker 1): ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಫ್ಲೈಟ್ ಇದ್ದ.\n1:22 (Speaker 2): ರೆ ಬೆಲೆ.ಹೋಲಿ.\n2:24 (Speaker 1): ಅದು ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್.\n2:30 (Speaker 2): ಇರುತ್ತೆ. ಅದು ರೇಟು ಕಡಿಮೆ ಆಗಿದ್ದು ನಮ್ಮ.\n2:36 (Speaker 1): ಫೋನ, 8381.\n2:49 (Speaker 2): ಥ್ಯಾಂಕ್ಸ್.\n",
    summary: "",
    // bill
    // enq
    // demo
    events: [
      {
        timestamp: "2025-04-21T16:46:46Z", // 00:15
        billNumber: ["URM01709"],
        enquiries: null,
        demographics: null,
        orderImgUrl:
          "https://5.imimg.com/data5/SELLER/Default/2023/12/369519654/JE/LO/KB/844696/a5-size-bill-book.jpg",
      },
      {
        timestamp: "2025-04-28T19:40:39Z", // 00:15
        billNumber: null,
        enquiries: ["ZINCONIA SYP 100ML"],
        demographics: null,
      },
      {
        timestamp: "2025-04-28T19:41:21Z", // 00:15
        billNumber: null,
        enquiries: ["Metrogyl Suspension 60 ml"],
        demographics: null,
      },
      {
        timestamp: "2025-04-28T19:42:55Z", // 00:15
        billNumber: null,
        enquiries: ["Emeset Syp 30 ml"],
        demographics: null,
      },
      {
        timestamp: "2025-04-28T19:40:39Z", // 01:45
        // billNumber: "BILL220422001",
        enquiries: ["ENQ002"],
        demographics: [["F", 28]],
      },
    ],
  },
};

// type Gender = "M" | "F";
// type Age = number;

// interface VideoEvent {
//   timestamp: string;
//   billNumber: string | null;
//   enquiries: string[];
//   demographics?: [Gender, Age][];
//   orderImgUrl?: string;
// }

// interface VideoDataInterface {
//   id: string;
//   name: string;
//   signedUrl: string;
//   startTimestamp: string;
//   endTimestamp: string;
//   numberOfEnquiries: number;
//   numberOfSales: number;
//   transcript: string;
//   events: VideoEvent[];
// }

// API function to fetch video details
const fetchVideoDetails = async (
  videoId: string
): Promise<VideoDataInterface> => {
  const USE_MOCK_DATA = true;
  const API_BASE_URL = "https://api.yourservice.com/videos";

  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(videoMocks[videoId]);
      }, 500);
    });
  } else {
    // Using actual API
    try {
      const response = await fetch(`${API_BASE_URL}/${videoId}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching video details:", error);
      throw error;
    }
  }
};
const VideoDetails: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("id");
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [video, setVideo] = React.useState<VideoDataInterface | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showTranscript, setShowTranscript] = React.useState(false);
  const [, setCurrentTime] = React.useState(0);

  React.useEffect(() => {
    if (!videoId) {
      setError("No video ID provided");
      setLoading(false);
      return;
    }

    const loadVideoDetails = async () => {
      try {
        const data = await fetchVideoDetails(videoId);
        setVideo(data);
      } catch (err) {
        setError("Failed to load video details");
      } finally {
        setLoading(false);
      }
    };

    loadVideoDetails();
  }, [videoId]);

  const durationInMinutes = () => {
    if (!video) return 0;
    const start = new Date(video.startTimestamp);
    const end = new Date(video.endTimestamp);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.round(diff);
  };

  const calculateTimeInVideo = (
    isoTimestamp: string,
    videoStartTime: string
  ): number => {
    const eventTime = new Date(isoTimestamp).getTime();
    const startTime = new Date(videoStartTime).getTime();
    return (eventTime - startTime) / 1000; // Convert to seconds
  };

  const jumpToTimestamp = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };

  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const videoStats = [
    // {
    //   title: "Date",
    //   value: video ? new Date(video.startTimestamp).toLocaleDateString() : "-",
    //   icon: <CalendarTodayIcon color="primary" />,
    //   bgColor: "rgba(76, 110, 245, 0.1)",
    //   iconColor: theme.palette.primary.main,
    // },
    {
      title: "Timing",
      value: `${
        video?.startTimestamp
          ? new Date(video.startTimestamp).toLocaleTimeString()
          : "-"
      } - ${
        video?.endTimestamp
          ? new Date(video.endTimestamp).toLocaleTimeString()
          : "-"
      }`,
      icon: <TimelapseSharp color="info" />,
      bgColor: "rgba(56, 178, 172, 0.1)",
      iconColor: theme.palette.info.main,
    },
    {
      title: "Duration",
      value: `${durationInMinutes()} mins`,
      icon: <TimelapseSharp color="info" />,
      bgColor: "rgba(56, 178, 172, 0.1)",
      iconColor: theme.palette.info.main,
    },
    {
      title: "Sentiment",
      value: "Netural",
      icon: <SentimentSatisfied color="success" />,
      bgColor: "rgba(72, 187, 120, 0.1)",
      iconColor: theme.palette.success.main,
    },
  ];

  const salesStats = [
    {
      title: "Enquiries ",
      value: video?.numberOfEnquiries || 0,
      icon: <QuestionAnswerIcon color="warning" />,
      bgColor: "rgba(246, 173, 85, 0.1)",
      iconColor: theme.palette.warning.main,
      variant: "h5",
    },
    {
      title: "Sales ",
      value: video?.numberOfSales || 0,
      icon: <ShoppingCartIcon color="success" />,
      bgColor: "rgba(72, 187, 120, 0.1)",
      iconColor: theme.palette.success.main,
      variant: "h5",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !video) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error || "Video not found"}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
          variant="contained"
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Header with back button, title and actions */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          bgcolor: "#2e6acf",
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          sx={{
            zIndex: 1000,
            color: "white",
            height: "100%",
            bgcolor: "transparent",
            transition: "border 0.3s ease",
            "&:hover": {
              border: "1px solid white",
              borderRadius: "10%",
            },
            boxShadow: "none",
          }}
        >
          <ArrowBackIcon
            sx={{ color: "white", height: "48px", width: "28px" }}
          />
        </Button>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Typography
              variant={"h4"}
              sx={{
                fontWeight: "bold",
                color: "white",
              }}
            >
              {video.name}
            </Typography>
            <Typography variant="body2" color="white">
              {new Date(video.startTimestamp).toLocaleDateString()} •{" "}
              {formatTime(video.startTimestamp)} -{" "}
              {formatTime(video.endTimestamp)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main content */}
      <Grid
        container
        spacing={0}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Video and events column */}
        <Grid sx={{ width: "100%" }}>
          <Grid container spacing={2} height={"100%"}>
            {/* Video player */}
            <Grid sx={{ width: { sm: "100%", md: "100%", lg: "66%" } }}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  background: "#000",
                  width: "100%",
                }}
              >
                {/* <Button
                  onClick={() => navigate(-1)}
                  variant="contained"
                  sx={{
                    position: "absolute",
                    bgcolor: "#000",
                    zIndex: 1000,
                    color: "white",
                    height: "40px",
                    width: "20px",
                    borderRadius: "10%",
                    border: "1px solid gray",
                  }}
                >
                  <ArrowBackIcon
                    sx={{ color: "white", height: "48px", width: "28px" }}
                  />
                </Button> */}

                <CardMedia
                  component="video"
                  controls
                  src={video.signedUrl}
                  poster="/video-placeholder.jpg"
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  sx={{
                    width: "100%",
                    objectFit: "contain",
                    height: "540px",
                    boxShadow: "none",
                  }}
                />
              </Paper>
            </Grid>
            <Grid
              sx={{
                width: { lg: "32%", md: "100%", sm: "100%" },
                display: "flex",
                alignItems: "flex-start",
                height: "100%",

                maxHeight: "560px",
              }}
            >
              <EventsTable
                events={(video?.events || []).map((event) => ({
                  ...event,
                  billNumber: event.billNumber ?? undefined,
                  timestamp: calculateTimeInVideo(
                    event.timestamp,
                    video.startTimestamp
                  ),
                  demographics: event.demographics?.map(([gender, age]) => [
                    gender as string,
                    age,
                  ]),
                  summary: video.summary,
                }))}
                jumpToTimestamp={jumpToTimestamp}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Stats and demographics column */}
        <Grid sx={{ width: "100%", display: "flex", boxShadow: "none" }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              height: "100%",
              background: "white",
              border: `1px solid ${theme.palette.divider}`,
              width: { lg: "100%", md: "100%" },
              maxHeight: "560px",
              display: "flex",
              justifyContent: "space-between",
              boxShadow: "none",
            }}
          >
            {/* Stats section */}
            <Box width={"32%"}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  pb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DescriptionIcon sx={{ mr: 1 }} /> Recording Summary
              </Typography>

              <Grid container spacing={2}>
                {videoStats.map((stat, index) => (
                  <Grid key={index}>
                    <StatusCard
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      bgColor={stat.bgColor}
                      iconColor={stat.iconColor}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box width={"30%"}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.info.main}`,
                  pb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PeopleIcon sx={{ mr: 1 }} /> Recorded Sales
              </Typography>
              <Grid container spacing={2}>
                {salesStats.map((stat, index) => (
                  <Grid key={index}>
                    <StatusCard
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      bgColor={stat.bgColor}
                      iconColor={stat.iconColor}
                      variant={stat.variant}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* Demographics section */}
            <Box width={"32%"}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  pb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PeopleIcon sx={{ mr: 1 }} /> Customer Demographics
              </Typography>

              {/* Demographic stats */}
              <Grid container spacing={2}>
                <Grid>
                  {/* <StatusCard
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    bgColor={stat.bgColor}
                    iconColor={stat.iconColor}
                    variant={stat.variant}
                  /> */}
                  <StatusCard
                    title="Male Count"
                    value={
                      (video.events ?? [])
                        .flatMap((e) => e.demographics || [])
                        .filter((d) => d[0] === "M").length
                    }
                    icon={<Man2Rounded color="primary" />}
                    bgColor="rgba(133, 89, 255, 0.1)"
                    iconColor={theme.palette.primary.main}
                    variant="h5"
                  />
                </Grid>
                <Grid>
                  <StatusCard
                    title="Female Count"
                    value={
                      (video.events ?? [])
                        .flatMap((e) => e.demographics || [])
                        .filter((d) => d[0] === "F").length
                    }
                    icon={
                      <Woman2Rounded
                        color="secondary"
                        fontSize={"medium"}
                        sx={{
                          height: "24px",
                          width: "24px",
                        }}
                      />
                    }
                    bgColor="rgba(255, 99, 132, 0.1)"
                    iconColor={theme.palette.secondary.main}
                    variant="h5"
                  />
                </Grid>
              </Grid>
            </Box>
            {/* <Button
              startIcon={<DownloadIcon />}
              onClick={() => window.open(video.signedUrl, "_blank")}
              variant="contained"
              size={"medium"}
              sx={{
                borderRadius: 2,
                alignSelf: "center",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                mt: 2,
                width: "100%",
              }}
            >
              Download Recording
            </Button> */}
          </Paper>
        </Grid>
        {/* Transcript Section */}
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            boxShadow: "none",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              borderRadius: 2,
              overflow: "hidden",

              width: { lg: "100%", md: "100%" },
              marginTop: 2,
              boxShadow: "none",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: showTranscript ? 1 : 0,
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DescriptionIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Transcript</Typography>
              </Box>
              <Button
                variant="outlined"
                endIcon={showTranscript ? <ExpandLess /> : <ExpandMore />}
                onClick={toggleTranscript}
              >
                {showTranscript ? "Hide" : "Show"}
              </Button>
            </Box>
            <Collapse in={showTranscript}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    whiteSpace: "pre-line",
                    fontFamily: "monospace",
                  }}
                >
                  {video.transcript}
                </Typography>
              </Box>
            </Collapse>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoDetails;
