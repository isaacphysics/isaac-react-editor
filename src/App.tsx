import React, { createContext, useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { Route, Routes } from 'react-router-dom';

import { defaultSelectedContext } from "./components/FileBrowser";
import { defaultEditorState } from "./components/SemanticEditor";
import { isLoggedIn, LoadingScreen, LoginPrompt, Logout } from "./services/auth";
import { defaultGithubContext, processCode } from "./services/github";
import { EditorScreen } from "./screens/EditorScreen";
import { HistoryRouter } from './components/HistoryRouter';
import { SemanticRoot } from "./components/semantic/SemanticRoot";
import { Content } from "./isaac-data-types";


export const AppContext = createContext({
    selection: defaultSelectedContext,
    editor: defaultEditorState,
    github: defaultGithubContext,
});

export const browserHistory = createBrowserHistory();

function RedirectTo({path}: {path: string}) {
    useEffect(() => {
        const dest = new URL(window.location.href);
        dest.pathname = path;
        window.location.replace(dest);
    });
    return <LoadingScreen message="Beginning editing..." />;
}

const testDoc = {
    "type": "isaacQuestionPage",
    "encoding": "markdown",
    "title": "Regression Test Page",
    "level": 0,
    "id": "_regression_test_",
    "author": "jsharkey13",
    "children": [
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
        }
    ],
    "subtitle": "Testing123",
    "published": true,
    "relatedContent": [
        "_regression_test_"
    ],
    "tags": []
} as unknown as Content;

function TestEditor() {
    const [doc, update] = useState(testDoc);
    return <SemanticRoot doc={doc} update={(newContent) => update(newContent)}/>;
}

function App() {
    const loggedIn = isLoggedIn();

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    useEffect(() => {
        processCode(code);
    }, [code]);

    return code ? <LoadingScreen/> : <HistoryRouter history={browserHistory}>
        <Routes>
            <Route path="/logout" element={<Logout />} />
            <Route path="test" element={<TestEditor/>} />
            {!loggedIn && <Route path="*" element={<LoginPrompt />} />}
            {loggedIn && <>
                <Route path="edit/:branch/*" element={<EditorScreen />} />
                <Route path="edit/:branch" element={<EditorScreen />} />
                <Route path="*" element={<RedirectTo path="edit/master" />} />
            </>}
        </Routes>
    </HistoryRouter>;
}

export default App;
