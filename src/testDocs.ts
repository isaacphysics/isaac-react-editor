import { Content } from "./isaac-data-types";

export const testQuiz = {
    "type": "isaacQuiz",
    "id": "quiz_rubric_test",
    "author": "bh412",
    "title": "Quiz rubric test (Do Not Publish)",
    "encoding": "markdown",
    "rubric": {
        "type": "content",
        "encoding": "markdown",
        "children": [
            {
                "type": "content",
                "value": "This quiz is a demo designed to show users how a rubric will be displayed!",
                "encoding": "markdown"
            }
        ]
    },
    "children": [
        {
            "id": "0ec982f6-e2bf-4974-b777-c50b9471beb1",
            "type": "isaacQuizSection",
            "title": "Circuits",
            "children": [
                {
                    "type": "content",
                    "value": "THIS IS A TEST OF RUBRIC",
                    "encoding": "markdown"
                },
                {
                    "encoding": "markdown",
                    "type": "isaacNumericQuestion",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "3.0",
                            "units": "V",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "84c48a78-2a27-4843-866a-c8895aa60e70",
                    "requireUnits": true,
                    "title": "Voltages 1",
                    "significantFiguresMin": 1,
                    "significantFiguresMax": 2,
                    "availableUnits": [
                        "V ",
                        " A ",
                        " \\Omega ",
                        " J ",
                        " W ",
                        " C ",
                        " s"
                    ],
                    "children": [
                        {
                            "type": "content",
                            "encoding": "markdown",
                            "value": "What is the voltage across resistor B?  Give your answer to two significant figures."
                        },
                        {
                            "type": "figure",
                            "value": "Parallel circuit of resistors",
                            "encoding": "markdown",
                            "src": "figures/25_6_test_2.svg",
                            "altText": "Two 1.5V cells in series are connected to a parallel circuit, one branch contains a resistor B."
                        }
                    ]
                },
                {
                    "type": "isaacNumericQuestion",
                    "encoding": "markdown",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "2.7",
                            "units": "V",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "5303de35-f66d-4e2f-9f4f-6be2e3bcefce",
                    "requireUnits": true,
                    "title": "Voltages 2",
                    "significantFiguresMin": 2,
                    "significantFiguresMax": 2,
                    "availableUnits": [
                        "V ",
                        " A ",
                        " \\Omega ",
                        " J ",
                        " W ",
                        " C ",
                        " s"
                    ],
                    "children": [
                        {
                            "type": "content",
                            "encoding": "markdown",
                            "value": ""
                        },
                        {
                            "type": "content",
                            "value": "What is the voltage across resistor A?  Give your answer to two significant figures.",
                            "encoding": "markdown"
                        },
                        {
                            "type": "figure",
                            "value": "Circuit with resistors",
                            "encoding": "markdown",
                            "src": "figures/25_6_test_2.svg",
                            "altText": "Two 1.5V cells in series are connected to a parallel circuit, one branch contains resistor A and another resistor in series.  The resistor in series with A has a voltage of 0.3V."
                        }
                    ]
                },
                {
                    "encoding": "markdown",
                    "type": "isaacNumericQuestion",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "2.4",
                            "units": "A",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "05d0982e-c729-477b-a3f3-64ce4d58253e",
                    "requireUnits": true,
                    "title": "Currents 1",
                    "significantFiguresMin": 2,
                    "significantFiguresMax": 2,
                    "availableUnits": [
                        "V ",
                        " A ",
                        " \\Omega ",
                        " J ",
                        " W ",
                        " C ",
                        " s"
                    ],
                    "children": [
                        {
                            "type": "content",
                            "encoding": "markdown",
                            "value": "What is the current at position Y?  Give your answer to two significant figures."
                        },
                        {
                            "type": "figure",
                            "value": "Parallel circuit of resistors",
                            "encoding": "markdown",
                            "src": "figures/23_7_test_path.svg",
                            "altText": "Three resistors are wired in parallel to a cell.  The current flowing out from the cell is 2.4A.  Current Y flows back to the cell."
                        }
                    ]
                },
                {
                    "encoding": "markdown",
                    "type": "isaacNumericQuestion",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "1.2",
                            "units": "A",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "5ea6bdee-a666-42b1-a6bf-86f161790d7b",
                    "requireUnits": true,
                    "title": "Currents 2",
                    "significantFiguresMin": 2,
                    "significantFiguresMax": 2,
                    "availableUnits": [
                        "V ",
                        " A ",
                        " \\Omega ",
                        " J ",
                        " W ",
                        " C ",
                        " s"
                    ],
                    "children": [
                        {
                            "type": "content",
                            "encoding": "markdown",
                            "value": "What is the current at position X?  Give your answer to two significant figures."
                        },
                        {
                            "type": "figure",
                            "value": "Parallel circuit of resistors",
                            "encoding": "markdown",
                            "src": "figures/23_7_test_path_2.svg",
                            "altText": "A cell is connected to three resistors in parallel.  The current leaving the cell is 2.4A, the current flowing in the first resistor (nearest the cell) is 1.2A, the current in the last resistor is 0.2A.  Current X flows in the wire connecting the first and second resistors to the cell."
                        }
                    ]
                }
            ]
        },
        {
            "id": "dcc74786-c69f-4a80-ae56-927f6270b761",
            "type": "isaacQuizSection",
            "title": "Calculations",
            "children": [
                {
                    "type": "content",
                    "value": "This test is to measure your progress having completed the baseline assessment and used the revision materials available for the [Summer Programme](/pages/summer_prog_year_10).\n\nUnless told otherwise, give your answers to **two or three significant figures**.  ",
                    "encoding": "markdown"
                },
                {
                    "type": "isaacNumericQuestion",
                    "encoding": "markdown",
                    "value": "How much charge flows through a lamp in $\\quantity{150}{s}$ if it carries a steady current of $\\quantity{0.40}{A}$? ",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "60.0",
                            "units": "C",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "a0fb4364-70bd-48c6-a197-e7312a2713ca",
                    "requireUnits": true,
                    "title": "Charge",
                    "significantFiguresMin": 2,
                    "significantFiguresMax": 3,
                    "availableUnits": [
                        "C ",
                        " s ",
                        " A ",
                        " \\Omega ",
                        " W ",
                        " J ",
                        " V"
                    ]
                },
                {
                    "value": "What resistance is needed if you wish to have a $\\quantity{20}{mA}$ current and the supply voltage is $\\quantity{30}{V}$?",
                    "encoding": "markdown",
                    "type": "isaacNumericQuestion",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "1500",
                            "units": "\\Omega",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        },
                        {
                            "encoding": "markdown",
                            "value": "1.5",
                            "units": "k\\Omega",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "fe171772-8b46-426e-b020-bbe4a059a2a2",
                    "requireUnits": true,
                    "title": "Resistance",
                    "significantFiguresMin": 1,
                    "significantFiguresMax": 3,
                    "availableUnits": [
                        "V ",
                        " A ",
                        " mA ",
                        " \\Omega ",
                        " k\\Omega ",
                        " kV"
                    ]
                },
                {
                    "value": "Two car headlamps each have a resistance of $\\quantity{3.0}{\\Omega}$.  They are connected in parallel to a $\\quantity{12}{V}$ battery.  What is the total current flowing?",
                    "encoding": "markdown",
                    "type": "isaacNumericQuestion",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "8.0",
                            "units": "A",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        },
                        {
                            "encoding": "markdown",
                            "value": "8000",
                            "units": "mA",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        },
                        {
                            "encoding": "markdown",
                            "value": "4.0",
                            "units": "A",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [
                                    {
                                        "type": "content",
                                        "value": "This is the current through one lamp, but the question asks for the current through both.",
                                        "encoding": "markdown"
                                    }
                                ],
                                "encoding": "markdown"
                            }
                        },
                        {
                            "encoding": "markdown",
                            "value": "4000",
                            "units": "mA",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [
                                    {
                                        "type": "content",
                                        "value": "This is the current through one lamp, but the question asks for the current through both.",
                                        "encoding": "markdown"
                                    }
                                ],
                                "encoding": "markdown"
                            }
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "43404e17-5672-416e-a8c5-7b91246b364c",
                    "title": "Headlamp",
                    "requireUnits": true,
                    "availableUnits": [
                        "V ",
                        " A ",
                        " mA ",
                        " \\Omega ",
                        " k\\Omega ",
                        " kV"
                    ],
                    "significantFiguresMin": 1,
                    "significantFiguresMax": 3
                },
                {
                    "value": "A $\\quantity{1.0}{kW}$ lamp is connected to the $\\quantity{230}{V}$ mains.  How much current flows?",
                    "encoding": "markdown",
                    "type": "isaacNumericQuestion",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "4.3478",
                            "units": "A",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "d10ab064-5c3a-45b9-aa6d-5b1184a11280",
                    "requireUnits": true,
                    "title": "Power",
                    "significantFiguresMin": 2,
                    "significantFiguresMax": 3,
                    "availableUnits": [
                        "W ",
                        " J ",
                        " s ",
                        " mJ ",
                        " A ",
                        " V ",
                        " C ",
                        " kV ",
                        " kW ",
                        " \\Omega ",
                        " kJ ",
                        " k\\Omega"
                    ]
                },
                {
                    "value": "If the motor in an electric car draws $\\quantity{700}{A}$ from a $\\quantity{360}{V}$ battery pack, what is its power?",
                    "encoding": "markdown",
                    "type": "isaacNumericQuestion",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "252",
                            "units": "kW",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        },
                        {
                            "encoding": "markdown",
                            "value": "252000",
                            "units": "W",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "46cf5505-1c91-4303-9547-ce66a728cb4b",
                    "requireUnits": true,
                    "title": "Electric car",
                    "significantFiguresMin": 2,
                    "significantFiguresMax": 3,
                    "availableUnits": [
                        "W ",
                        " J ",
                        " s ",
                        " mJ ",
                        " A ",
                        " V ",
                        " C ",
                        " kV ",
                        " kW ",
                        " \\Omega ",
                        " kJ ",
                        " k\\Omega"
                    ]
                },
                {
                    "value": "A cable has a resistance of $\\quantity{0.20}{\\Omega}$ and carries a current of $\\quantity{60}{A}$.  What is the power dissipated by the cable?",
                    "encoding": "markdown",
                    "type": "isaacNumericQuestion",
                    "choices": [
                        {
                            "encoding": "markdown",
                            "value": "720",
                            "units": "W",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        },
                        {
                            "encoding": "markdown",
                            "value": "0.72",
                            "units": "kW",
                            "type": "quantity",
                            "explanation": {
                                "type": "content",
                                "children": [],
                                "encoding": "markdown"
                            },
                            "correct": true
                        }
                    ],
                    "answer": {
                        "type": "content",
                        "value": "_Enter answer here_",
                        "encoding": "markdown"
                    },
                    "id": "34641d31-d6c2-4ffa-91ca-af93e25138fa",
                    "title": "Power cable",
                    "requireUnits": true,
                    "significantFiguresMin": 2,
                    "significantFiguresMax": 3,
                    "availableUnits": [
                        "W ",
                        " J ",
                        " s ",
                        " mJ ",
                        " A ",
                        " V ",
                        " C ",
                        " kV ",
                        " kW ",
                        " \\Omega ",
                        " kJ ",
                        " k\\Omega"
                    ]
                }
            ]
        }
    ],
    "published": false,
    "visibleToStudents": true
} as unknown as Content;

const testDoc = {
    "type": "isaacQuestionPage",
    "encoding": "markdown",
    "title": "Regression Test Page",
    "level": 0,
    "id": "_regression_test_",
    "author": "jsharkey13",
    "children": [
        {
            "type": "anvilApp",
            "appId": "SMOE3VGUJXYQCXA4",
            "appAccessKey": "QEOWRDHYIVB2KY2I4S4HI66K"
        },
        {
            "type": "content",
            "encoding": "markdown",
            "value": "This page is to speed up regression testing of question behaviors. **Changing anything on this page is liable to break the automated testing**. Do so in the knowledge *you* will have to fix it . . . `git blame` is a powerful tool!"
        },
        {
            "type": "content",
            "layout": "accordion",
            "children": [
                {
                    "type": "content",
                    "children": [
                        {
                            "type": "content",
                            "children": [
                                {
                                    "type": "isaacGraphSketcherQuestion",
                                    "encoding": "markdown",
                                    "value": "Sketch a graph of $y=x^2 e^x$.",
                                    "choices": [
                                        {
                                            "encoding": "markdown",
                                            "value": "",
                                            "graphSpec": "through: -Xaxis, topLeft, -Xaxis, origin, +Xaxis, topRight\nslope: start=flat, end=up\npoints: maxima in topLeft, minima at origin",
                                            "type": "graphChoice",
                                            "explanation": {
                                                "type": "content",
                                                "children": [],
                                                "encoding": "markdown"
                                            },
                                            "correct": true
                                        }
                                    ],
                                    "answer": {
                                        "type": "content",
                                        "value": "_Enter answer here_",
                                        "encoding": "markdown"
                                    },
                                    "id": "28497c07-3235-4737-be23-9af0a308b39a",
                                    "title": "$y=x^2 e^x$"
                                }
                            ],
                            "title": "$y=x^2 e^x$"
                        },
                        {
                            "value": "This is a quick question.",
                            "encoding": "markdown",
                            "type": "isaacQuestion",
                            "choices": [
                                {
                                    "encoding": "markdown",
                                    "value": "This is a correct choice. It will never be used.",
                                    "type": "choice",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "Correct Choice!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "This is an incorrect choice. It will also never be used.",
                                    "type": "choice",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "Incorrect Choice",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                }
                            ],
                            "answer": {
                                "type": "content",
                                "value": "This is the answer. It will be shown to students when they click the \"Show/Hide\" button.",
                                "encoding": "markdown"
                            },
                            "id": "_regression_test_quick_",
                            "hints": [
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is a Hint on a Quick Question. It will never be used.",
                                            "encoding": "markdown"
                                        }
                                    ]
                                }
                            ],
                            "title": "Quick Question"
                        }
                    ],
                    "id": "acc_quick_q"
                },
                {
                    "type": "content",
                    "children": [
                        {
                            "type": "isaacMultiChoiceQuestion",
                            "encoding": "markdown",
                            "value": "This is a multiple choice question. The correct answer is $42$. Correct choices in the editor have a ✔️ next to them.",
                            "choices": [
                                {
                                    "encoding": "markdown",
                                    "value": "$42$",
                                    "type": "choice",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is a correct choice.",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "$69$",
                                    "type": "choice",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is an incorrect choice.",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": false
                                }
                            ],
                            "answer": {
                                "type": "content",
                                "value": "This is the answer; the correct answer is $42$.",
                                "encoding": "markdown"
                            },
                            "id": "_regression_test_multi_",
                            "hints": [
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 1.",
                                            "encoding": "markdown"
                                        }
                                    ]
                                },
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 2. It contains a figure!",
                                            "encoding": "markdown"
                                        },
                                        {
                                            "type": "figure",
                                            "value": "This is a figure caption!",
                                            "encoding": "markdown",
                                            "src": "../questions/physics/mechanics/dynamics/level4/figures/Dynamics_Spouting_Can3.svg",
                                            "altText": "This is figure AltText.",
                                            "id": "_regression_test_figure_"
                                        }
                                    ]
                                }
                            ],
                            "title": "Multiple Choice",
                            "randomiseChoices": true
                        }
                    ],
                    "id": "acc_multi_q"
                },
                {
                    "type": "content",
                    "children": [
                        {
                            "type": "isaacMultiChoiceQuestion",
                            "encoding": "markdown",
                            "value": "This is a multiple choice question. The correct answer is $42$. Correct choices in the editor have a ✔️ next to them.",
                            "choices": [
                                {
                                    "encoding": "markdown",
                                    "value": "$42$",
                                    "type": "choice",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is a correct choice.",
                                                "encoding": "html"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "$69$",
                                    "type": "choice",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is an incorrect choice.",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": false
                                }
                            ],
                            "answer": {
                                "type": "content",
                                "value": "This is the answer; the correct answer is $42$.",
                                "encoding": "markdown"
                            },
                            "id": "_regression_test_multi2_",
                            "hints": [
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 1.",
                                            "encoding": "markdown"
                                        }
                                    ]
                                },
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 2. It contains a figure!",
                                            "encoding": "markdown"
                                        },
                                        {
                                            "type": "figure",
                                            "value": "This is a figure caption!",
                                            "encoding": "markdown",
                                            "src": "../questions/physics/mechanics/dynamics/level4/figures/Dynamics_Spouting_Can3.svg",
                                            "altText": "This is figure AltText.",
                                            "id": "_regression_test_figure_"
                                        }
                                    ]
                                }
                            ],
                            "title": "Multiple Choice",
                            "randomiseChoices": true
                        }
                    ],
                    "id": "acc_multi_q2"
                },
                {
                    "type": "content",
                    "children": [
                        {
                            "value": "The answer to this question is $\\quantity{2.01}{m\\\\,s^{-1}}$. The wrong answer is $\\quantity{5.00}{m\\\\,s^{-1}}$. A known wrong answer to the wrong number of sig figs is $\\quantity{42}{m\\\\,s^{-1}}$, it should say \"Hello\" on selecting it, not a sig fig warning. The answer $999$ requires no units. The units $\\units{m\\\\,s^{-1}}$ are not in `availableUnits`, so if they appear the selection code works correctly!",
                            "encoding": "markdown",
                            "type": "isaacNumericQuestion",
                            "choices": [
                                {
                                    "encoding": "markdown",
                                    "value": "2.01",
                                    "units": "m\\,s^{-1}",
                                    "type": "quantity",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is a correct choice.",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "5.00",
                                    "units": "m\\,s^{-1}",
                                    "type": "quantity",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is an incorrect choice.",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "42",
                                    "units": "m\\,s^{-1}",
                                    "type": "quantity",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "Hello",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "999",
                                    "units": "",
                                    "type": "quantity",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This answer required no units!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "12345",
                                    "units": "",
                                    "type": "quantity",
                                    "explanation": {
                                        "type": "content",
                                        "value": "This should say \"Significant Figures\" above!",
                                        "encoding": "markdown",
                                        "tags": [
                                            "sig_figs"
                                        ]
                                    }
                                }
                            ],
                            "answer": {
                                "type": "content",
                                "value": "The answer is $\\quantity{2.01}{m\\\\,s^{-1}}$. You can write the symbolic form of the answer here, and the answer to more significant figures than necessary.",
                                "encoding": "markdown"
                            },
                            "id": "_regresssion_test_numeric_",
                            "requireUnits": true,
                            "hints": [
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 1.\n\n**Concepts**\n\n\\link{Circles and chords}{/concepts/cm_geometry2}\n\n\\link{Equations of motion}{/concepts/cp_eq_of_motion}\n\n\\link{Trigonometric sums}{/concepts/cm_trig2}\n",
                                            "encoding": "markdown"
                                        }
                                    ]
                                },
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 2.",
                                            "encoding": "markdown"
                                        }
                                    ]
                                },
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 3.",
                                            "encoding": "markdown"
                                        }
                                    ]
                                },
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 4.",
                                            "encoding": "markdown"
                                        },
                                        {
                                            "type": "anvilApp",
                                            "appId": "EW6Q7UNQQT3HIJ3W",
                                            "appAccessKey": "EMAJA6ZMDQT764TGQNW2DTJF",
                                            "author": "jsharkey13"
                                        }
                                    ],
                                    "id": "isaac_anvil_info"
                                }
                            ],
                            "title": "Numeric Question",
                            "availableUnits": [
                                "K ",
                                " J ",
                                " mW ",
                                " m\\,s^{-2}                ",
                                " J ",
                                " km ",
                                " T ",
                                " km\\,s^{-1} ",
                                " nJ ",
                                " J ",
                                " GY"
                            ],
                            "significantFiguresMin": 3,
                            "significantFiguresMax": 3,
                            "relatedContent": [
                                "_regression_test_"
                            ]
                        }
                    ],
                    "id": "acc_numeric_q"
                },
                {
                    "type": "content",
                    "children": [
                        {
                            "type": "isaacSymbolicQuestion",
                            "encoding": "markdown",
                            "choices": [
                                {
                                    "encoding": "markdown",
                                    "value": "$x$",
                                    "pythonExpression": "x",
                                    "requiresExactMatch": true,
                                    "type": "formula",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is a correct choice. It requires an exact match!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "$y$",
                                    "pythonExpression": "y",
                                    "requiresExactMatch": false,
                                    "type": "formula",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is an incorrect choice. Anything that can be mathematically simplified to $y$ will match it!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "$\\Delta x = v \\Delta t$",
                                    "pythonExpression": "Deltax == v * Deltat",
                                    "requiresExactMatch": false,
                                    "type": "formula",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This tests the $\\Delta x$ syntax!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "$x'$",
                                    "pythonExpression": "x_prime",
                                    "requiresExactMatch": false,
                                    "type": "formula",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This tests the $x^{\\prime}$ syntax!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                }
                            ],
                            "answer": {
                                "type": "content",
                                "value": "This is the answer: $x$. Any important notes on the solution can go here.",
                                "encoding": "markdown"
                            },
                            "id": "_regression_test_symbolic_",
                            "hints": [
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 1.",
                                            "encoding": "markdown"
                                        }
                                    ]
                                }
                            ],
                            "title": "Symbolic Question",
                            "availableSymbols": [
                                "x ",
                                " y ",
                                " v ",
                                " sin() ",
                                " >= ",
                                " arccos() ",
                                " Derivative(;x) ",
                                " Deltax ",
                                " Deltat ",
                                " x_prime ",
                                " deltax ",
                                " dx",
                                " pi"
                            ],
                            "children": [
                                {
                                    "type": "content",
                                    "encoding": "markdown",
                                    "value": "This is a symbolic question. The answer is $x$."
                                }
                            ],
                            "formulaSeed": "[{\"type\":\"Symbol\",\"position\":{\"x\":1193.12,\"y\":518},\"expression\":{\"latex\":\"x\",\"python\":\"x\"},\"properties\":{\"letter\":\"x\"}}]"
                        }
                    ],
                    "id": "acc_symbolic_q"
                },
                {
                    "type": "content",
                    "children": [
                        {
                            "type": "isaacSymbolicChemistryQuestion",
                            "encoding": "markdown",
                            "value": "This is a chemistry question. The correct answer is $\\ce{H + Cl}$, an incorrect answer is $\\ce{H}$.",
                            "choices": [
                                {
                                    "encoding": "markdown",
                                    "mhchemExpression": "H + Cl",
                                    "value": "",
                                    "type": "chemicalFormula",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is a correct choice.",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "mhchemExpression": "H",
                                    "value": "",
                                    "type": "chemicalFormula",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is an incorrect answer for string matching to match!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": false
                                }
                            ],
                            "answer": {
                                "type": "content",
                                "value": "Enter the correct answer here: $\\ce{H + Cl}$.",
                                "encoding": "markdown"
                            },
                            "id": "_regression_test_chemistry_",
                            "title": "Chemistry Question",
                            "hints": [
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 1.",
                                            "encoding": "markdown"
                                        }
                                    ]
                                }
                            ],
                            "availableSymbols": [
                                "H",
                                " Cl"
                            ]
                        }
                    ],
                    "id": "acc_chemistry_q"
                },
                {
                    "type": "content",
                    "children": [
                        {
                            "type": "isaacStringMatchQuestion",
                            "encoding": "markdown",
                            "value": "This is a string matching question. Type the value `hello` for a correct answer, `Hello` for a known wrong answer, and `any case` for a case-insensitive match.",
                            "choices": [
                                {
                                    "encoding": "markdown",
                                    "value": "hello",
                                    "type": "stringChoice",
                                    "caseInsensitive": false,
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This needs a lower case \"h\".",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "Hello",
                                    "type": "stringChoice",
                                    "caseInsensitive": false,
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is a known wrong answer!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "any case",
                                    "type": "stringChoice",
                                    "caseInsensitive": true,
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "A case-insensitive match.",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                }
                            ],
                            "answer": {
                                "type": "content",
                                "value": "Enter some explanation of why `hello` is correct here!",
                                "encoding": "markdown"
                            },
                            "id": "_regression_test_stringmatch_",
                            "title": "String Match Question",
                            "hints": [
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "content",
                                            "value": "This is Hint 1.",
                                            "encoding": "markdown"
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "id": "acc_stringmatch_q"
                },
                {
                    "type": "content",
                    "children": [
                        {
                            "type": "isaacFreeTextQuestion",
                            "encoding": "markdown",
                            "value": "This is a free text question. It is slightly more forgiving for longer text than String Match.\n\nTry answering \"Why did the chicken cross the road?\" below, and so long as your answer contains 'get to' and 'other side' it should be correct. It will be incorrect with custom feedback if you include 'did not' or 'didn't'.",
                            "choices": [
                                {
                                    "encoding": "markdown",
                                    "value": "*get to*other side*",
                                    "type": "freeTextRule",
                                    "caseInsensitive": true,
                                    "allowsAnyOrder": false,
                                    "allowsExtraWords": false,
                                    "allowsMisspelling": false,
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is a correct answer!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "didn't|[did not]",
                                    "type": "freeTextRule",
                                    "caseInsensitive": true,
                                    "allowsAnyOrder": false,
                                    "allowsExtraWords": true,
                                    "allowsMisspelling": false,
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "Spoil sport!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                }
                            ],
                            "answer": {
                                "type": "content",
                                "value": "It's a joke, and refusing to engage gets custom feedback.",
                                "encoding": "markdown"
                            },
                            "id": "_regression_test_freetext_",
                            "title": "Free Text Question"
                        }
                    ],
                    "id": "acc_freetext_q"
                },
                {
                    "type": "content",
                    "children": [
                        {
                            "type": "isaacSymbolicLogicQuestion",
                            "encoding": "markdown",
                            "value": "This is a boolean/symbolic logic question. Anything that simplifies to $\\and{A}{B}$ will be marked as correct, and anything that simplifies to $\\or{A}{B}$ will be marked incorrect with custom feedback.",
                            "choices": [
                                {
                                    "encoding": "markdown",
                                    "value": "$\\and{A}{B}$",
                                    "pythonExpression": "A & B",
                                    "requiresExactMatch": true,
                                    "type": "logicFormula",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This is exactly $\\and{A}{B}$; congratualtions!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "$\\and{A}{B}$",
                                    "pythonExpression": "A & B",
                                    "requiresExactMatch": false,
                                    "type": "logicFormula",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This simplifies to $\\and{A}{B}$!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    },
                                    "correct": true
                                },
                                {
                                    "encoding": "markdown",
                                    "value": "$\\or{A}{B}$",
                                    "pythonExpression": "A | B",
                                    "requiresExactMatch": false,
                                    "type": "logicFormula",
                                    "explanation": {
                                        "type": "content",
                                        "children": [
                                            {
                                                "type": "content",
                                                "value": "This doesn't simplify to $\\and{A}{B}$, in fact it simplifies to $\\or{A}{B}$!",
                                                "encoding": "markdown"
                                            }
                                        ],
                                        "encoding": "markdown"
                                    }
                                }
                            ],
                            "answer": {
                                "type": "content",
                                "value": "Some explanation of why the answer should be $\\and{A}{B}$ . . .",
                                "encoding": "markdown"
                            },
                            "id": "_regression_test_logic_",
                            "title": "Symbolic Logic Question"
                        }
                    ]
                },
                {
                    "type": "content",
                    "children": [
                        {
                            "type": "content",
                            "value": "This is a test for whether \\ref{fig2}, \\ref{fig3} and \\ref{fig4} are referenced correctly!",
                            "encoding": "markdown"
                        },
                        {
                            "type": "content",
                            "layout": "horizontal",
                            "encoding": "markdown",
                            "children": [
                                {
                                    "type": "figure",
                                    "value": "This should be Figure 2.",
                                    "encoding": "markdown",
                                    "src": "figures/docking_points_example.png",
                                    "id": "fig2",
                                    "altText": "This is figure AltText."
                                },
                                {
                                    "type": "figure",
                                    "value": "This should be Figure 3.",
                                    "encoding": "markdown",
                                    "src": "figures/docking_points_example_separate.png",
                                    "id": "fig3",
                                    "altText": "This is figure AltText."
                                }
                            ]
                        },
                        {
                            "type": "figure",
                            "value": "This should be Figure 4.",
                            "encoding": "markdown",
                            "src": "figures/123_tab_highlight.PNG",
                            "id": "fig4",
                            "title": "",
                            "altText": "This is figure AltText."
                        },
                        {
                            "type": "content",
                            "layout": "tabs",
                            "children": [
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "figure",
                                            "value": "This should be Figure 5.",
                                            "encoding": "markdown",
                                            "src": "figures/operations_tab_highlight.PNG",
                                            "id": "fig5",
                                            "altText": "This is figure AltText."
                                        }
                                    ],
                                    "title": "Figure 5",
                                    "id": "tab_fig5"
                                },
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "type": "figure",
                                            "value": "This should be Figure 6.",
                                            "encoding": "markdown",
                                            "src": "figures/exponents_example.PNG",
                                            "id": "fig6",
                                            "altText": "This is figure AltText."
                                        }
                                    ],
                                    "title": "Figure 6"
                                },
                                {
                                    "type": "content",
                                    "children": [
                                        {
                                            "value": "This should contain \\ref{fig7}.",
                                            "encoding": "markdown",
                                            "type": "isaacQuestion",
                                            "choices": [],
                                            "answer": {
                                                "type": "content",
                                                "encoding": "markdown",
                                                "children": [
                                                    {
                                                        "type": "figure",
                                                        "value": "This should be Figure 7.",
                                                        "encoding": "markdown",
                                                        "src": "figures/trig_int_tab_highlight.PNG",
                                                        "id": "fig7",
                                                        "altText": "This is figure AltText."
                                                    }
                                                ]
                                            },
                                            "id": "quick_question_fig7"
                                        }
                                    ],
                                    "title": "Figure 7"
                                }
                            ]
                        },
                        {
                            "type": "figure",
                            "value": "This should be Figure 8.",
                            "encoding": "markdown",
                            "src": "figures/sample_question_border.PNG",
                            "altText": "This is figure AltText.",
                            "id": "fig8"
                        },
                        {
                            "type": "video",
                            "encoding": "markdown",
                            "src": "https://www.youtube.com/watch?v=mE6LQZrbu30"
                        }
                    ],
                    "id": "acc_figure_numbering"
                }
            ]
        },
        {
            "id": "email-contact-us-form",
            "type": "emailTemplate",
            "encoding": "markdown",
            "title": "",
            "subject": "Contact Form",
            "author": "jps79",
            "plainTextContent": "Hello,\n\nThe contact form has been submitted, please see the details below.\n\nFirst name: {{contactGivenName}}\nLast Name: {{contactFamilyName}}\nEmail: {{contactEmail}}\nUser ID: {{contactUserId}}\nRole: {{contactUserRole}}\n\nSubject: {{contactSubject}}\n\nMessage: {{contactMessage}}\n\nRegards,\n\n{{sig}}",
            "htmlContent": "Hello,<br><br>The contact form has been submitted, please see the details below.<br><br>First name: {{contactGivenName}}<br>Last Name: {{contactFamilyName}}<br>Email: {{contactEmail}}<br>User ID: {{contactUserId}}<br>Role: {{contactUserRole}}<br><br>Subject: {{contactSubject}}<br><br>Message: {{contactMessage}}<br><br>Regards,<br><br>{{sig}}",
            "published": true
        }
    ],
    "subtitle": "Testing123",
    "published": true,
    "relatedContent": [
        "_regression_test_"
    ],
    "tags": []
} as unknown as Content;

export const testEvent = {
    "id": "09122015swanwick",
    "layout": "1-col",
    "title": "Student Workshop",
    "subtitle": "Problem Solving with Vectors",
    "tags": [
        "student",
        "vectors"
    ],
    "author": "allydavies",
    "location": {
        "latitude": 53.0741903941314,
        "longitude": -1.39697638852278,
        "address": {
            "town": "Swanwick",
            "county": "Derbyshire",
            "postalCode": "DE55 1AE",
            "addressLine2": "Derby Road",
            "addressLine1": "Swanwick Hall School"
        }
    },
    "eventThumbnail": {
        "src": "../../images/vectors.jpg",
        "type": "image",
        "altText": "Free body diagrams.",
        "id": "eventThumbnail"
    },
    "date": 1449678600000,
    "numberOfPlaces": 40,
    "eventStatus": "CLOSED",
    "preResources": [
        {
            "title": "Event brochure",
            "url": "somewhere/interesting.pdf"
        }
    ],
    "postResources": [
        {
            "title": "Event brochure",
            "url": "somewhere/interesting.pdf"
        }
    ],
    "encoding": "markdown",
    "type": "isaacEventPage",
    "children": [
        {
            "type": "content",
            "value": "#### Event details \n\n### Are you...\n* aiming for A* to B grade in A-Level Physics and Maths?\n* hoping to study Physics, Engineering or Maths at a top university?\n* keen to improve your problem solving skills?\n\n### Aims\nThis free workshop aims to develop each student's confidence and problem solving skills in a core area of physics by tackling a range of examples from idealised problems through to real-world situations.\n\nStudents will be guided through the problem solving process, and will solve a range of unusual problems using vectors with help and guidance from teachers.\n\n### Target Audience\nAS and A2 students, who are aiming to achieve A* to B grades in both Physics and Maths A level.\n\n### Timetable\n16:15  Refreshments and starter problems<br>\n16:30  Introductory Session <br>\n16:45  Problem Solving Session <br>\n18:15  Plenary / close & feedback forms<br> \n18:30  End\n\n### Preparation\nGuidance and pre-workshop tasks will be emailed upon registration. Read and follow the instructions to secure your place.\n\n### Bring with you\nStudents should bring to the workshop:\n\n* written solutions to the pre-workshop questions,\n* a pen, pencil, plenty of paper and a calculator.\n\n### Registering for the event\nStudents are welcome to attend with or without their teachers, but any teachers and students who wish to attend must register.  \n\n<div style=\"width:100%; text-align:left;\" ><iframe  src=\"//eventbrite.co.uk/tickets-external?eid=19163191622&ref=etckt\" frameborder=\"0\" height=\"250\" width=\"100%\" vspace=\"0\" hspace=\"0\" marginheight=\"5\" marginwidth=\"5\" scrolling=\"auto\" allowtransparency=\"true\"></iframe><div style=\"font-family:Helvetica, Arial; font-size:10px; padding:5px 0 5px; margin:2px; width:100%; text-align:left;\" ><a class=\"powered-by-eb\" style=\"color: #dddddd; text-decoration: none;\" target=\"_blank\" href=\"http://www.eventbrite.co.uk/r/etckt\">Powered by Eventbrite</a></div></div>\n",
            "encoding": "markdown"
        }
    ],
    "published": true
} as unknown as Content;
