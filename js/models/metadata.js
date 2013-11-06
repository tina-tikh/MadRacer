/**
 * Model of the game
 */
(function (app) {
    app.metadata = {
        cars: {
            'ford_mustang_gt390_fastback': {
                src: 'img/cars/ford_mustang_gt390_fastback.png',
                size: {
                    length: 33,
                    width: 14.85
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 86,
                        y: 45,
                        width: 660,
                        height: 297
                    }
                }
            },
            'bentley_continental_r_fastback': {
                src: 'img/cars/bentley_continental_r_fastback.png',
                size: {
                    length: 38.8,
                    width: 14.9
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 26,
                        y: 41,
                        width: 776,
                        height: 298
                    }
                }
            },
            'Aston_Martin_DB5': {
                src: 'img/cars/Aston_Martin_DB5.png',
                size: {
                    length: 33.25,
                    width: 14.75
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 86,
                        y: 51,
                        width: 665,
                        height: 295
                    }
                }
            },
            'austin_cooper_s': {
                src: 'img/cars/austin_cooper_s.png',
                size: {
                    length: 22.7,
                    width: 13.7
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 194,
                        y: 73,
                        width: 454,
                        height: 274
                    }
                }
            },
            'Austin_Haley_BJ8_3000MkIIIP_II': {
                src: 'img/cars/Austin_Haley_BJ8_3000MkIIIP_II.png',
                size: {
                    length: 28.35,
                    width: 13.45
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 136,
                        y: 61,
                        width: 567,
                        height: 269
                    }
                }
            },
            'BMW_M1': {
                src: 'img/cars/BMW_M1.png',
                size: {
                    length: 31.35,
                    width: 15.2
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 108,
                        y: 43,
                        width: 627,
                        height: 304
                    }
                }
            },
            'bugatti_veyron': {
                src: 'img/cars/bugatti_veyron.png',
                size: {
                    length: 34.8,
                    width: 16.1
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 77,
                        y: 28,
                        width: 696,
                        height: 322
                    }
                }
            },
            'citroen_ds': {
                src: 'img/cars/citroen_ds.png',
                size: {
                    length: 34.35,
                    width: 15.1
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 79,
                        y: 45,
                        width: 687,
                        height: 302
                    }
                }
            },
            'delage_d8_120s_aerosport': {
                src: 'img/cars/delage_d8_120s_aerosport.png',
                size: {
                    length: 37.85,
                    width: 14.35
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 34,
                        y: 50,
                        width: 757,
                        height: 287
                    }
                }
            },
            'delahaye': {
                src: 'img/cars/delahaye.png',
                size: {
                    length: 28.25,
                    width: 14.05
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 140,
                        y: 60,
                        width: 565,
                        height: 281
                    }
                }
            },
            'ferrari_250': {
                src: 'img/cars/ferrari_250.png',
                size: {
                    length: 31.15,
                    width: 14.45
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 110,
                        y: 55,
                        width: 623,
                        height: 289
                    }
                }
            },
            'ferrari_275': {
                src: 'img/cars/ferrari_275.png',
                size: {
                    length: 31.5,
                    width: 14.75
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 108,
                        y: 53,
                        width: 630,
                        height: 295
                    }
                }
            },
            'Ford_GT40': {
                src: 'img/cars/Ford_GT40.png',
                size: {
                    length: 30.85,
                    width: 15.75
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 113,
                        y: 33,
                        width: 617,
                        height: 315
                    }
                }
            },
            'ford_t': {
                src: 'img/cars/ford_t.png',
                size: {
                    length: 26.35,
                    width: 13.85
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 179,
                        y: 57,
                        width: 527,
                        height: 277
                    }
                }
            },
            'jeep_willys': {
                src: 'img/cars/jeep_willys.png',
                size: {
                    length: 24,
                    width: 13.7
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 179,
                        y: 54,
                        width: 480,
                        height: 274
                    }
                }
            },
            'lamborghini_countach_lp400': {
                src: 'img/cars/lamborghini_countach_lp400.png',
                size: {
                    length: 29.3,
                    width: 15.7
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 122,
                        y: 17,
                        width: 586,
                        height: 314
                    }
                }
            },
            'maserati': {
                src: 'img/cars/maserati.png',
                size: {
                    length: 33.3,
                    width: 15.15
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 89,
                        y: 44,
                        width: 666,
                        height: 303
                    }
                }
            },
            'mclaren_f1': {
                src: 'img/cars/mclaren_f1.png',
                size: {
                    length: 32.25,
                    width: 15.25
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 111,
                        y: 33,
                        width: 645,
                        height: 305
                    }
                }
            },
            'mercedes-benz_300sl_gullwing': {
                src: 'img/cars/mercedes-benz_300sl_gullwing.png',
                size: {
                    length: 34.4,
                    width: 14.9
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 89,
                        y: 41,
                        width: 688,
                        height: 298
                    }
                }
            },
            'Pagani_Zonda_Cinque': {
                src: 'img/cars/Pagani_Zonda_Cinque.png',
                size: {
                    length: 34.1,
                    width: 17.55
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 82,
                        y: 13,
                        width: 682,
                        height: 351
                    }
                }
            },
            'pegaso': {
                src: 'img/cars/pegaso.png',
                size: {
                    length: 29.6,
                    width: 14.25
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 124,
                        y: 58,
                        width: 592,
                        height: 285
                    }
                }
            },
            'peugeot_402_darmat_coupe': {
                src: 'img/cars/peugeot_402_darmat_coupe.png',
                size: {
                    length: 31.25,
                    width: 13.95
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 105,
                        y: 53,
                        width: 625,
                        height: 279
                    }
                }
            },
            'Porsche_911': {
                src: 'img/cars/Porsche_911.png',
                size: {
                    length: 30.6,
                    width: 14.65
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 116,
                        y: 57,
                        width: 612,
                        height: 293
                    }
                }
            },
            'Porsche_917K': {
                src: 'img/cars/Porsche_917K.png',
                size: {
                    length: 31.6,
                    width: 15.65
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 101,
                        y: 36,
                        width: 632,
                        height: 313
                    }
                }
            },
            'rolls_royce_silver': {
                src: 'img/cars/rolls_royce_silver.png',
                size: {
                    length: 38.4,
                    width: 15.6
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 38,
                        y: 36,
                        width: 768,
                        height: 312
                    }
                }
            },
            'VW_Beetle': {
                src: 'img/cars/VW_Beetle.png',
                size: {
                    length: 29.4,
                    width: 13.25
                },
                correction: {
                    angle: 180,
                    crop: {
                        x: 127,
                        y: 59,
                        width: 588,
                        height: 265
                    }
                }
            }
        },
        targets: {
            'zombie': {
                src: 'img/zombie-sprite.png',
                size: {
                    length: 24.5,
                    width: 20.25
                },
                correction: {
                    angle: 0
                },
                count: 20,
                perFrame: 5
            }
        },
        world: {
            'bg-src': 'img/sand.png',
            building: {
                src: 'img/roof.png'
            },
            initState: {
                scale: 2.5,
                points: [],
                size: {
                    width: 600,
                    length: 1200
                },
                racer: {
                    model: 'bugatti_veyron',
                    position: { x: 700, y: 300 }
                },
                enemies: [
                    {
                        model: 'ford_mustang_gt390_fastback',
                        position: { x: 1000, y: 300 }
                    }
                ],
                targets: [
                    {
                        type: 'zombie',
                        position: { x: 180, y: 30 }
                    },
                    {
                        type: 'zombie',
                        position: { x: 550, y: 60 }
                    },
                    {
                        type: 'zombie',
                        position: { x: 410, y: 280 }
                    },
                    {
                        type: 'zombie',
                        position: { x: 140, y: 20 }
                    },
                    {
                        type: 'zombie',
                        position: { x: 600, y: 450 }
                    },
                    {
                        type: 'zombie',
                        position: { x: 440, y: 40 }
                    },
                    {
                        type: 'zombie',
                        position: { x: 200, y: 390 }
                    },
                    {
                        type: 'zombie',
                        position: { x: 400, y: 140 }
                    },
                    {
                        type: 'zombie',
                        position: { x: 400, y: 590 }
                    },
                    {
                        type: 'zombie',
                        position: { x: 250, y: 40 }
                    }
                ],
                buildings: [
                    {
                        position: { x: 100, y: 100},
                        size: {width: 100, length: 100}
                    },
                    {
                        position: { x: 100, y: 300},
                        size: {width: 100, length: 100}
                    },
                    {
                        position: { x: 100, y: 500},
                        size: {width: 100, length: 100}
                    },
                    {
                        position: { x: 500, y: 100},
                        size: {width: 100, length: 100}
                    },
                    {
                        position: { x: 500, y: 300},
                        size: {width: 100, length: 100}
                    },
                    {
                        position: { x: 500, y: 500},
                        size: {width: 100, length: 100}
                    },
                    {
                        position: { x: 900, y: 100},
                        size: {width: 100, length: 100}
                    },
                    {
                        position: { x: 900, y: 300},
                        size: {width: 100, length: 100}
                    }
                ]
            }
        }
    }
})(epam.madracer);