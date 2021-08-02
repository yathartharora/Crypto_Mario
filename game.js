kaboom({
    global: true,
    fullscreen: true,
    debug: true,
    scale: 1,
    clearColor: [0,0,0,1],
  })

    const MOVE_SPEED = 150
    var CURRENT_MOVE_SPEED = MOVE_SPEED
    const FAST_SPEED = 500
    const JUMP_FORCE = 300
    var CURRENT_JUMP_FORCE = JUMP_FORCE
    const BIG_JUMP_FORCE = 400
    var isJumping = true
    const FALL_DEATH = 500
  

  loadSprite('coin','https://i.imgur.com/fXaF7G7.png')
  loadSprite('evil-shroom','https://i.imgur.com/hxtFpBg.png')
  loadSprite('brick','https://i.imgur.com/pogC9x5.png')
  loadSprite('block','https://i.imgur.com/M6rwarW.png')
  loadSprite('mario','https://i.imgur.com/Wb1qfhK.png')
  loadSprite('mushroom','https://i.imgur.com/lamYqWj.png')
  loadSprite('surprise','https://i.imgur.com/gesQ1KP.png')
  loadSprite('unboxed','https://i.imgur.com/bdrLpi6.png')
  loadSprite('pipe-top-left','https://i.imgur.com/ReTPiWY.png')
  loadSprite('pipe-top-right','https://i.imgur.com/hj2GK4n.png')
  loadSprite('pipe-bottom-left','https://i.imgur.com/c1cYSbt.png')
  loadSprite('pipe-bottom-right','https://i.imgur.com/nqQ79eI.png')
  loadSprite('keys','https://i.imgur.com/h3MaVaL.png')
  loadSprite('dollar','https://i.imgur.com/TX1Rowr.png')


  scene("game", ({level, score}) => {
      layers(['bg', 'obj', 'ui'], 'obj')

      const maps = [
        [
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                                                                                                                ',
            '                                                          % % % % % % % % % %                                                                   ',
            '                                                                                                                                                ',
            '     %   =*=%=                                                                                 =%=%=%=%=%=%=@==                                 ',
            '                                                       ==========================                                                           -+  ',
            '                     ^  ^                                                                                                   ^     ^      ^  ()  ',
            '================================    ================                               =============================================================',
        ],
        [
            '                                                                                                                   ',
            '                                 !     !      !      !                                                                  ',
            '                              ==========================                                                                ',
            '                           }                                                                                            ',
            '                        }  }                                                                                            ',
            '                     }  }  }                                                                                            ',
            '                  }  }  }  }                                                                                            ',
            '                  }  }  }  }                    ^         ^         ^           ^                                       ',
            ' ======================================================================================                                 ',
            '                                                                                                                        ',
            '                                                                                                                        ',
            '                                                                                                                        ',
            '                                                     ! ! !    !!!!!      !    !!!!!                                     ',
            '                                                     ! ! !      !       !!!     !                                       ',
            '                                                     !        !!!!!    !   !    !                                       ',
            ' ===================   =====   =====    =====     =========================================================             ',
            '                                                                                                                        ',
            '                                                                                                                        ',
            '                                                                                                                        ',
        ],
      ] 

      const levelCfg = {
          width: 20,
          height: 20,
          '=': [sprite('block'), solid()],
          '$': [sprite('coin'), 'coin', scale(0.2)],
          '%': [sprite('surprise'), solid(), 'coin-surprise'],
          '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
          '@': [sprite('surprise'), solid(), 'keys-surprise'],
          '}': [sprite('unboxed'), solid()],
          '(': [sprite('pipe-bottom-left'), solid(),scale(0.5), 'pipe'],
          ')': [sprite('pipe-bottom-right'), solid(),scale(0.5), 'pipe'],
          '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
          '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
          '^': [sprite('evil-shroom'), solid(), 'danger', scale(0.5), body()],
          '#': [sprite('mushroom'),solid(), 'mushroom', body()],
          '&': [sprite('keys'),solid(), 'keys', body(), scale(0.2)],
          '!': [sprite('dollar'), solid(), 'dollar', scale(0.5)],

      }

      const gameLevel = addLevel(maps[level], levelCfg)

      const scoreLabel = add([
          text('Score: ' + parseInt(score)),
          pos(40,0),
          layer('ui'),
          {
              value: score
          }
      ])

      add([
          text('level '+ parseInt(level +1)), 
          pos(40,10),
          layer('ui')
      ])

      add([
          text('Rules: 1. You cannot Earn Bitcoins without the mining machine'),
          pos(40,20),
          layer('ui')
      ])

      function big() {
          var timer = 0
          var isBig = false
          return{
              update() {
                  if (isBig){
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                    timer -= dt()
                    if (timer<=0) {
                        this.smallify()
                    }
                }
            },
          isBig() {
              return isBig
          },
          smallify() {
              this.scale = vec2(1)
              timer = 0
              isBig = false
              CURRENT_JUMP_FORCE = JUMP_FORCE
          },
          biggify(time) {
            this.scale = vec2(2)
            timer = time
            isBig = true
            
          }
        }
      }

      const player = add([
          sprite('mario'), solid(), 
          pos(30,0),
          body(),
          big(),
          origin('bot')
      ])

      action('mushroom', (m) => {
          m.move(20,0)
      })

      player.on("headbump", (obj) => {
          if(obj.is('coin-surprise')){
              gameLevel.spawn('$', obj.gridPos.sub(0,4))
              destroy(obj)
              gameLevel.spawn('}', obj.gridPos.sub(0,0))

          }

          if(obj.is('mushroom-surprise')) {
              gameLevel.spawn('#', obj.gridPos.sub(0,1))
              destroy(obj)
              gameLevel.spawn('}', obj.gridPos.sub(0,0))
          }

          if(obj.is('keys-surprise')) {
              gameLevel.spawn('&', obj.gridPos.sub(0,4))
              destroy(obj)
              gameLevel.spawn('}', obj.gridPos.sub(0,0))
          }
      })

      action('danger',(d) => {
          d.move(-20,0)
      })

      action('keys',(k) => {
          k.move(30,0)
      })

      player.collides('pipe', () => {
          keyDown('down', () => {
              go('game', {
                  level: (level+ 1),
                  score: scoreLabel.value
              })
          })
      })

      player.collides('mushroom', (m) => {
          destroy(m)
          player.biggify(20)
      })

      player.collides('keys', (k) => {
          destroy(k)
          player.biggify(20)
          CURRENT_MOVE_SPEED = FAST_SPEED
      })

      player.collides('coin', (c) => {
          destroy(c)
          scoreLabel.value++
          scoreLabel.text = scoreLabel.value
      })

      player.collides('dollar', (d) => {
          destroy(d)
          scoreLabel.value++
          scoreLabel.text = scoreLabel.value
          CURRENT_MOVE_SPEED = MOVE_SPEED
      })

      player.collides('danger', (d) => {
          if(isJumping) {
              destroy(d)
          } else{
          go('lose', { score: scoreLabel.value})
          }
      })

      player.action(() => {
          camPos(player.pos)
          if((player.pos.y) >= FALL_DEATH){
              go('lose', {score: scoreLabel.value})
          }
      })

      keyDown('left', () => {
          player.move(-CURRENT_MOVE_SPEED,0)
      })
      keyDown('right', () => {
        player.move(CURRENT_MOVE_SPEED,0)
    })

    player.action(() => {
        if(player.grounded()) {
            isJumping = false
        }
    })
    keyPress('space', () => {
        if(player.grounded()) {
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })
  
  })

  scene('lose', ({ score }) => {
      add([
          text(score, 32),
          origin('center'),
          pos(width()/2, height()/2)
      ])
  })
  
  start("game", {level: 0,score: 0})
