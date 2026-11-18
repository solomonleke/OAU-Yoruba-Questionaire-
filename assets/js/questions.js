/**
 * Complete bilingual schema for OAU Yorùbá AI Thesis Questionnaire.
 * Source: OAU_Yoruba_AI_Thesis_Questionnaire-v2.docx
 *
 * IMPORTANT:
 * - Every `value` property on options and scale choices is CANONICAL YORÙBÁ.
 * - Switching the UI to English or Bilingual only changes what is displayed;
 *   values submitted to Google Sheets remain strictly Yorùbá.
 */
window.QUESTIONNAIRE_DATA = {
  meta: {
    institution: {
      yo: "YUNIFÁSÍTÌ ỌBÁFẸ́MI AWÓLỌ́WỌ̀, ILÉ-IFẸ̀",
      en: "OBAFEMI AWOLOWO UNIVERSITY, ILE-IFE"
    },
    faculty: {
      yo: "Ẹ̀KA Ẹ̀KỌ́ IṢẸ́-Ọ̀NÀ ÀTI ÌMỌ̀ Ẹ̀KỌ́ ÀWÙJỌ",
      en: "Faculty of Arts & Humanities / Social Sciences"
    },
    department: {
      yo: "Ẹ̀ka Ẹ̀kọ́ àti Ìmọ̀ Ẹ̀kọ́",
      en: "Department of Education / Yorùbá Language Studies"
    },
    title: {
      yo: "ÌWÉ ÌBÉÈRÈ LÓRÍ ÀGBÉYẸ̀WÒ ÌLÒ Ẹ̀RỌ AYÉLUJÁRA ÒYE-ÀTỌWỌ́DÁ (AI) LÁÀÁRÍN ÀWỌN AKẸ́KỌ̀Ọ́",
      en: "QUESTIONNAIRE ON THE ASSESSMENT OF ARTIFICIAL INTELLIGENCE (AI) TOOL USAGE AMONG STUDENTS"
    },
    salutation: {
      yo: "Sí Olùdáhùn,",
      en: "Dear Respondent,"
    },
    intro: {
      yo: "Ìwé ìbéèrè yìí dá lórí àkọ́rí tí a sọ sókè yìí, gẹ́gẹ́ bí apá kan nínú iṣẹ́ ìwádìí tí a ó fi sílẹ̀ fún Ẹ̀ka Ẹ̀kọ́ Iṣẹ́-Ọ̀nà àti Ìmọ̀ Ẹ̀kọ́ Àwùjọ, Yunifásítì Ọbáfẹ́mi Awólọ́wọ̀, Ilé-Ifẹ̀. Jọ̀wọ́, pèsè àwọn àlàyé tí a béèrè fún nínú ààyè tí a pèsè. A ó tọ́jú gbogbo ìdáhùn rẹ gẹ́gẹ́ bí aṣírí. Ẹ ṣeun.",
      en: "This questionnaire is based on the research topic stated above as part of a thesis to be submitted to the Faculty of Arts & Humanities / Social Sciences, Obafemi Awolowo University, Ile-Ife. Kindly provide the requested information in the spaces provided. All your responses will be kept strictly confidential. Thank you."
    },
    instructionLabel: {
      yo: "Ìtọ́ni:",
      en: "Instruction:"
    },
    instruction: {
      yo: "Jọ̀wọ́ fi àmì (✔) sí inú àpótí tó bá èrò rẹ mu jùlọ fún ìbéèrè kọ̀ọ̀kan.",
      en: "Please select the option that best represents your view for each item."
    },
    confidentiality: {
      yo: "Aṣírí ni gbogbo ìdáhùn rẹ",
      en: "All responses are strictly confidential"
    },
    closingThanks: {
      yo: "Ẹ ṣeun púpọ̀ fún àkókò àti ìrànwọ́ yín!",
      en: "Thank you very much for your time and cooperation!"
    }
  },

  ratingKeyTitle: {
    yo: "ÌTỌ́KASÍ ÌDÍWỌ̀N ÌDÁHÙN",
    en: "RESPONSE RATING SCALE KEY"
  },

  likertScale: [
    {
      value: "Mo Gbà Dáadáa",
      codeYo: "MGD (MFG)",
      shortYo: "MGD",
      labelYo: "Mo Gbà Dáadáa",
      shortEn: "SA",
      labelEn: "Strongly Agree",
      score: 4
    },
    {
      value: "Mo Gbà",
      codeYo: "MG (MF)",
      shortYo: "MG",
      labelYo: "Mo Gbà",
      shortEn: "A",
      labelEn: "Agree",
      score: 3
    },
    {
      value: "N Kò Gbà",
      codeYo: "NKG (NKF)",
      shortYo: "NKG",
      labelYo: "N Kò Gbà",
      shortEn: "D",
      labelEn: "Disagree",
      score: 2
    },
    {
      value: "N Kò Gbà Rárá",
      codeYo: "NKGR (NKFR)",
      shortYo: "NKGR",
      labelYo: "N Kò Gbà Rárá",
      shortEn: "SD",
      labelEn: "Strongly Disagree",
      score: 1
    }
  ],

  demographicsSection: {
    id: "A",
    title: {
      yo: "ÌPÍN A: ÀTÒJỌ FÁYẸ̀WÒ NÍPA ARA ẸNI",
      en: "SECTION A: DEMOGRAPHIC DATA"
    },
    subtitle: {
      yo: "Jọ̀wọ́ kọ tàbí yan àlàyé tó bá ọ mu.",
      en: "Please enter or select the details that apply to you."
    },
    items: [
      {
        id: "A1",
        number: 1,
        type: "select",
        required: true,
        label: {
          yo: "Ẹ̀ka",
          en: "Faculty"
        },
        placeholder: {
          yo: "-- Yan Ẹ̀ka --",
          en: "-- Select Faculty --"
        },
        options: [
          {
            value: "Ẹ̀ka Iṣẹ́-Ọ̀nà",
            labelYo: "Ẹ̀ka Iṣẹ́-Ọ̀nà",
            labelEn: "Arts"
          },
          {
            value: "Ẹ̀ka Ìmọ̀ Ẹ̀kọ́",
            labelYo: "Ẹ̀ka Ìmọ̀ Ẹ̀kọ́",
            labelEn: "Education"
          }
        ]
      },
      {
        id: "A2",
        number: 2,
        type: "select",
        required: true,
        label: {
          yo: "Ẹ̀ka Ẹ̀kọ́",
          en: "Department"
        },
        placeholder: {
          yo: "-- Yan Ẹ̀ka Ẹ̀kọ́ --",
          en: "-- Select Department --"
        },
        options: [
          {
            value: "Ẹ̀ka Ẹ̀kọ́ Ìmọ̀ Èdè àti Àwọn Èdè Ilẹ̀ Adúláwọ̀",
            labelYo: "Ẹ̀ka Ẹ̀kọ́ Ìmọ̀ Èdè àti Àwọn Èdè Ilẹ̀ Adúláwọ̀",
            labelEn: "Linguistics and African Languages"
          },
          {
            value: "Ẹ̀ka Ẹ̀kọ́ Iṣẹ́-Ọ̀nà àti Ìmọ̀ Ẹ̀kọ́ Àwùjọ",
            labelYo: "Ẹ̀ka Ẹ̀kọ́ Iṣẹ́-Ọ̀nà àti Ìmọ̀ Ẹ̀kọ́ Àwùjọ",
            labelEn: "Arts and Social Sciences Education"
          }
        ]
      },
      {
        id: "A3",
        number: 3,
        type: "radio",
        required: true,
        label: {
          yo: "Iṣẹ́ Rẹ",
          en: "Status"
        },
        options: [
          { value: "Akẹ́kọ̀ọ́", labelYo: "Akẹ́kọ̀ọ́", labelEn: "Student" },
          { value: "Olùkọ́", labelYo: "Olùkọ́", labelEn: "Lecturer" }
        ]
      },
      {
        id: "A4",
        number: 4,
        type: "radio",
        required: true,
        conditionalNotApplicableOn: { field: "A3", equals: "Olùkọ́", fallbackValue: "Kò Kàn Mí (Olùkọ́)" },
        label: {
          yo: "Ìpele Ẹ̀kọ́ (Akẹ́kọ̀ọ́)",
          en: "Level (Students Only)"
        },
        notApplicableHint: {
          yo: "Kò kàn àwọn olùkọ́ — a ti fi sí 'Kò Kàn Mí (Olùkọ́)' fúnra rẹ̀.",
          en: "Not applicable for lecturers — automatically recorded as Not Applicable (Lecturer)."
        },
        options: [
          { value: "100", labelYo: "100", labelEn: "100 Level" },
          { value: "200", labelYo: "200", labelEn: "200 Level" },
          { value: "300", labelYo: "300", labelEn: "300 Level" },
          { value: "400", labelYo: "400", labelEn: "400 Level" }
        ]
      },
      {
        id: "A5",
        number: 5,
        type: "radio",
        required: true,
        label: {
          yo: "Ọjọ́ Orí",
          en: "Age Bracket"
        },
        options: [
          { value: "16 – 20", labelYo: "16 – 20", labelEn: "16 – 20" },
          { value: "21 – 25", labelYo: "21 – 25", labelEn: "21 – 25" },
          { value: "26 – 30", labelYo: "26 – 30", labelEn: "26 – 30" },
          { value: "31+", labelYo: "31+", labelEn: "31+" }
        ]
      },
      {
        id: "A6",
        number: 6,
        type: "radio",
        required: true,
        label: {
          yo: "Akọ / Abo",
          en: "Gender"
        },
        options: [
          { value: "Akọ", labelYo: "Akọ", labelEn: "Male" },
          { value: "Abo", labelYo: "Abo", labelEn: "Female" }
        ]
      },
      {
        id: "A7",
        number: 7,
        type: "radio",
        required: true,
        label: {
          yo: "Lílo ẹ̀rọ ayélujára òye-àtọwọ́dá (AI) ṣáájú àkókò yìí",
          en: "Prior experience using AI tools"
        },
        options: [
          { value: "Bẹ́ẹ̀ni", labelYo: "Bẹ́ẹ̀ni", labelEn: "Yes" },
          { value: "Bẹ́ẹ̀kọ́", labelYo: "Bẹ́ẹ̀kọ́", labelEn: "No" }
        ]
      }
    ]
  },

  likertSections: [
    {
      id: "B",
      title: {
        yo: "ÌPÍN B: ÀWỌN IRINṢẸ́ ÒYE-ÀTỌWỌ́DÁ TÍ A LÈ LÒ FÚN KÍKỌ́ ÈDÈ YORÙBÁ",
        en: "SECTION B: ARTIFICIAL INTELLIGENCE (AI) TOOLS FOR LEARNING/TEACHING YORÙBÁ"
      },
      items: [
        {
          id: "B1",
          number: 1,
          yo: "ChatGPT jẹ́ irinṣẹ́ tí a lè lò fún kíkọ́ èdè Yorùbá.",
          en: "ChatGPT is a tool that can be used for learning/teaching the Yorùbá language."
        },
        {
          id: "B2",
          number: 2,
          yo: "YorubaGPT jẹ́ irinṣẹ́ tó wúlò fún kíkọ́ èdè Yorùbá.",
          en: "YorubaGPT is a useful tool for learning/teaching the Yorùbá language."
        },
        {
          id: "B3",
          number: 3,
          yo: "Duolingo (Yoruba) ṣeé lò fún ìkọ́ni ìró àti ọ̀rọ̀ Yorùbá.",
          en: "Duolingo (Yoruba) can be used for teaching Yorùbá sounds and vocabulary."
        },
        {
          id: "B4",
          number: 4,
          yo: "Google Translate ṣeé lò fún ìtumọ̀ sí èdè Yorùbá.",
          en: "Google Translate can be used for translation into the Yorùbá language."
        },
        {
          id: "B5",
          number: 5,
          yo: "Ẹ̀rọ Ayélujára Òye-Àtọwọ́dá (AI) fún ṣíṣe ohun èlò ìdánimọ̀ ohùn (speech recognition tools) ṣeé lò fún ìkọ́ni ní ìró ohùn.",
          en: "AI speech recognition tools can be used for teaching Yorùbá pronunciation and speech sounds."
        },
        {
          id: "B6",
          number: 6,
          yo: "Àwọn chatbot Yorùbá ṣeé lò fún ìdánilẹ́kọ̀ọ́ ẹni-kọ̀ọ̀kan.",
          en: "Yorùbá chatbots can be used for individualized/personalized instruction."
        },
        {
          id: "B7",
          number: 7,
          yo: "Àwọn irinṣẹ́/ohun èlò ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI tools) lè ṣe ìrànwọ́ fún ṣíṣe iṣẹ́ ẹ̀kọ́ Yorùbá.",
          en: "Artificial Intelligence (AI) tools can help in completing Yorùbá academic coursework."
        }
      ]
    },
    {
      id: "C",
      title: {
        yo: "ÌPÍN C: ÌHÀ ÀWỌN OLÙKỌ́ ÀTI AKẸ́KỌ̀Ọ́ SÍ LÍLO Ẹ̀RỌ ÒYE-ÀTỌWỌ́DÁ",
        en: "SECTION C: ATTITUDES OF LECTURERS AND STUDENTS TOWARD USING AI TOOLS"
      },
      items: [
        {
          id: "C1",
          number: 1,
          yo: "Mo kọ ìhà rere sí lílo Ẹ̀rọ Ayélujára Òye-Àtọwọ́dá (AI) fún kíkọ́ èdè Yorùbá.",
          en: "I have a positive attitude toward using AI tools for learning/teaching the Yorùbá language."
        },
        {
          id: "C2",
          number: 2,
          yo: "Mo gbà pé ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) lè ṣe ìrànwọ́ fún kíkọ́ èdè Yorùbá.",
          en: "I believe that AI tools can support the teaching and learning of the Yorùbá language."
        },
        {
          id: "C3",
          number: 3,
          yo: "Mo fẹ́ lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) fún ìkọ́ni gírámà àti ìró Yorùbá.",
          en: "I want to use AI tools for teaching Yorùbá grammar and phonology."
        },
        {
          id: "C4",
          number: 4,
          yo: "Mo ní ìgboyà láti lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) nínú ẹ̀kọ́ èdè Yorùbá.",
          en: "I have the confidence to use AI tools in Yorùbá language education."
        },
        {
          id: "C5",
          number: 5,
          yo: "Mo gbà pé ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) kò ní pa ipa àwọn olùkọ́ run láàárín àwùjọ.",
          en: "I believe AI tools will not destroy or replace the role of teachers/lecturers in society."
        },
        {
          id: "C6",
          number: 6,
          yo: "Mo ní ìtara sí lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) fún kíkọ́ èdè Yorùbá.",
          en: "I am enthusiastic about using AI tools for learning/teaching the Yorùbá language."
        },
        {
          id: "C7",
          number: 7,
          yo: "Mo ní ìbẹ̀rù pé ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) lè mú kí n gbẹ́kẹ̀lé ẹ̀rọ ju àwọn olùkọ́ lọ.",
          en: "I worry that AI tools could make me depend on technology more than on lecturers/teachers."
        },
        {
          id: "C8",
          number: 8,
          yo: "Mo ní ìmọ̀ tó pọ̀ nípa bí a ṣe lè lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) dáadáa.",
          en: "I have substantial knowledge of how to use AI tools effectively."
        }
      ]
    },
    {
      id: "D",
      title: {
        yo: "ÌPÍN D: ÀǸFÀÀNÍ ÀTI ÌPÈNÍJÀ LÍLO Ẹ̀RỌ ÒYE-ÀTỌWỌ́DÁ",
        en: "SECTION D: BENEFITS AND CHALLENGES OF USING AI TOOLS"
      },
      items: [
        {
          id: "D1",
          number: 1,
          group: "benefit",
          yo: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń mú kí ìmọ̀ mi nínú èdè Yorùbá jinlẹ̀ sí i.",
          en: "AI tools deepen my knowledge of the Yorùbá language."
        },
        {
          id: "D2",
          number: 2,
          group: "benefit",
          yo: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń ṣe ìrànwọ́ fún ìdánilẹ́kọ̀ọ́ ẹni-kọ̀ọ̀kan.",
          en: "AI tools support personalized/individualized learning."
        },
        {
          id: "D3",
          number: 3,
          group: "benefit",
          yo: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń pèsè ìdáhùn fún àwọn akẹ́kọ̀ọ́ àti olùkọ́ lẹ́sẹ̀kẹsẹ̀.",
          en: "AI tools provide instant responses/feedback to students and lecturers."
        },
        {
          id: "D4",
          number: 4,
          group: "benefit",
          yo: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń ṣe ìrànwọ́ fún ìkọ́ni ìró ohùn àti gírámà.",
          en: "AI tools assist in teaching pronunciation/speech sounds and grammar."
        },
        {
          id: "D5",
          number: 5,
          group: "benefit",
          yo: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń mú kí kíkọ́ èdè Yorùbá rọrùn láti kọ́.",
          en: "AI tools make the Yorùbá language easier to learn."
        },
        {
          id: "D6",
          number: 6,
          group: "benefit",
          yo: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń ṣe ìrànwọ́ fún ìpamọ́ òwe àti àṣà Yorùbá láàárín àwùjọ.",
          en: "AI tools help preserve Yorùbá proverbs and culture within society."
        },
        {
          id: "D7",
          number: 7,
          group: "challenge",
          yo: "Àìtó àwọn ẹ̀rọ bíi (fóònù/kọ̀ǹpútà) ń dí mi lọ́wọ́ láti lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI).",
          en: "Inadequate access to devices (such as smartphones or computers) hinders me from using AI tools."
        },
        {
          id: "D8",
          number: 8,
          group: "challenge",
          yo: "Àwọn ìdáhùn ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) kì í sábà bá àṣà Yorùbá mu.",
          en: "Responses from AI tools often do not align with Yorùbá culture."
        },
        {
          id: "D9",
          number: 9,
          group: "challenge",
          yo: "Àìní ìmọ̀ nípa bí a ṣe lè lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń jẹ́ ìdíwọ́ fún lílò rẹ̀.",
          en: "Lack of knowledge on how to use AI tools is a barrier to their use."
        }
      ]
    },
    {
      id: "E",
      title: {
        yo: "ÌPÍN E: Ọ̀NÀ TÍ A LÈ GBÀ MÚ KÍ LÍLO Ẹ̀RỌ AYÉLUJÁRA ÒYE-ÀTỌWỌ́DÁ (AI) RỌRÙN",
        en: "SECTION E: WAYS TO FACILITATE THE USE OF AI TOOLS"
      },
      items: [
        {
          id: "E1",
          number: 1,
          yo: "Ó yẹ kí a pèsè ẹ̀rọ (ICT) tó dára nínú yàrá ìkẹ́kọ̀ọ́.",
          en: "Quality ICT equipment should be provided in lecture rooms/classrooms."
        },
        {
          id: "E2",
          number: 2,
          yo: "Ó yẹ kí a ṣe ìdánilẹ́kọ̀ọ́ fún àwọn olùkọ́ àti akẹ́kọ̀ọ́ nípa lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI).",
          en: "Training workshops should be organized for lecturers and students on using AI tools."
        },
        {
          id: "E3",
          number: 3,
          yo: "Ó yẹ kí a ṣe àwọn irinṣẹ́ ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) tí ó bá àṣà Yorùbá mu.",
          en: "AI tools should be developed to align with Yorùbá culture."
        },
        {
          id: "E4",
          number: 4,
          yo: "Ó yẹ kí a fi ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) kún kọ̀ríkúlọ̀ọ̀mù èdè Yorùbá.",
          en: "AI should be integrated into the Yorùbá language curriculum."
        },
        {
          id: "E5",
          number: 5,
          yo: "Ó yẹ kí a pèsè ìsopọ̀ ayélujára (internet) tó dára.",
          en: "Reliable internet connectivity should be provided."
        },
        {
          id: "E6",
          number: 6,
          yo: "Ó yẹ kí a ṣe àwọn chatbot àti app tí ó ní òwe àti àṣà Yorùbá.",
          en: "Chatbots and apps containing Yorùbá proverbs and culture should be developed."
        },
        {
          id: "E7",
          number: 7,
          yo: "Ó yẹ kí ìjọba àti yunifásítì ṣe ìrànwọ́ fún ìmúgbòòrò lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI).",
          en: "The government and the university should support expanding the use of AI tools."
        }
      ]
    }
  ],

  openEndedSection: {
    id: "F",
    title: {
      yo: "ÌPÍN F: ÌBÉÈRÈ ṢÍṢÍ",
      en: "SECTION F: OPEN-ENDED QUESTIONS"
    },
    note: {
      yo: "Àkíyèsí: Tí ó bá ṣeé ṣe, ẹ lè kọ ìdáhùn yín ní èdè Yorùbá kí ó lè bá àtúpalẹ̀ ìwádìí Yorùbá mu.",
      en: "Note: Please respond in Yorùbá if possible to support the Yorùbá thesis analysis (English responses are also welcome)."
    },
    items: [
      {
        id: "F1",
        number: 1,
        required: false,
        yo: "Kí ni àwọn ìṣòro mìíràn tí o ń dojú kọ nínú lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) fún kíkọ́ èdè Yorùbá?",
        en: "What other challenges do you face in using AI tools for learning/teaching the Yorùbá language?",
        placeholder: {
          yo: "Kọ ìdáhùn rẹ síbí...",
          en: "Write your response here..."
        }
      },
      {
        id: "F2",
        number: 2,
        required: false,
        yo: "Kí ni o dábàá láti mú kí lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) dára sí i fún kíkọ́ èdè Yorùbá ní Yunifásítì Ọbáfẹ́mi Awólọ́wọ̀?",
        en: "What do you suggest to improve the use of AI tools for Yorùbá language education at Obafemi Awolowo University?",
        placeholder: {
          yo: "Kọ àbá rẹ síbí...",
          en: "Write your suggestions here..."
        }
      }
    ]
  },

  ui: {
    languageLabel: { yo: "Èdè:", en: "Language:" },
    langButtons: {
      yo: "Yorùbá",
      bi: "Èdè Méjì (Bilingual)",
      en: "English"
    },
    progressLabel: { yo: "Ìdáhùn:", en: "Answered:" },
    requiredBadge: { yo: "Dandan", en: "Required" },
    optionalBadge: { yo: "Àṣàyàn", en: "Optional" },
    statementHeader: { yo: "Àkóónú Ìbéèrè", en: "Questionnaire Items" },
    responseLabel: { yo: "Ìdáhùn:", en: "Response:" },
    submitButton: { yo: "Fi Ìdáhùn Ránṣẹ́", en: "Submit Questionnaire" },
    submittingButton: { yo: "Ń fi ránṣẹ́ sí Google Excel...", en: "Submitting to Google Sheets..." },
    clearButton: { yo: "Pa Àtúnṣe Rẹ́", en: "Clear Form" },
    clearConfirm: {
      yo: "Ṣé o dá ọ lójú pé o fẹ́ pa gbogbo ìdáhùn tí o ti tẹ̀ rẹ́?",
      en: "Are you sure you want to clear all your answers?"
    },
    missingErrorPrefix: {
      yo: "Jọ̀wọ́ parí àwọn ìbéèrè wọ̀nyí kí o tó fi ránṣẹ́:",
      en: "Please complete the following required questions before submitting:"
    },
    notConfiguredTitle: {
      yo: "Àkíyèsí Olùṣàkóso: Àdírẹ́sì Google Apps Script kò tíì wà ní config.js",
      en: "Admin Notice: Google Apps Script URL is not yet set in assets/js/config.js"
    },
    notConfiguredHint: {
      yo: "O lè ṣe àyẹ̀wò ìfọ̀rọ̀wánilẹ́nuwò yìí báyìí, ṣùgbọ́n láti fi ìdáhùn pamọ́ sí Google Sheet, gbé google-apps-script/Code.gs sórí Apps Script kí o sì fi Web App URL sínú assets/js/config.js.",
      en: "You can test filling the form now, and to save live responses to Google Sheets, deploy google-apps-script/Code.gs and paste the Web App URL into assets/js/config.js."
    },
    successTitle: {
      yo: "A ti gba ìdáhùn rẹ! Ẹ ṣeun púpọ̀!",
      en: "Your response has been recorded! Thank you!"
    },
    successBody: {
      yo: "A ti fi ìdáhùn rẹ pamọ́ ní èdè Yorùbá sínú àkájọ Google Excel fún ìwádìí yìí.",
      en: "Your response has been saved strictly in Yorùbá to the research Google Sheet."
    },
    submitAnother: {
      yo: "Dáhùn Ìwé Ìbéèrè Mìíràn",
      en: "Submit Another Response"
    },
    networkError: {
      yo: "Ìṣòro ìsopọ̀ ayélujára wáyé. A ti tọ́jú àwọn ìdáhùn rẹ sínú ẹ̀rọ rẹ — jọ̀wọ́ tún gbìyànjú.",
      en: "Network error while sending. Your answers are safely saved locally — please try again."
    },
    reportLink: {
      yo: "Ìròyìn & Àbájáde (Olùwádìí)",
      en: "Researcher Report (Yorùbá)"
    }
  }
};
