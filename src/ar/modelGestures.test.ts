import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { MAX_ZOOM, MIN_ZOOM, ModelView, pixelsToRadians } from './modelGestures'

const settle = (view: ModelView) => {
  for (let i = 0; i < 120; i++) view.update(1 / 60)
}

describe('ModelView', () => {
  it('memutar mengikuti sumbu yang diberikan dan bisa melewati 360°', () => {
    const view = new ModelView()
    const up = new Vector3(0, 1, 0)
    // 360° penuh dalam beberapa gerakan: kembali ke orientasi semula.
    for (let i = 0; i < 8; i++) view.rotate(up, Math.PI / 4)
    settle(view)
    expect(Math.abs(view.spin.quaternion.w)).toBeCloseTo(1, 3)

    view.rotate(up, Math.PI / 2)
    settle(view)
    const front = new Vector3(0, 0, 1).applyQuaternion(view.spin.quaternion)
    expect(front.x).toBeCloseTo(1, 3) // permukaan depan bergerak ke kanan
  })

  it('zoom dibatasi dan reset mengembalikan keadaan awal', () => {
    const view = new ModelView()
    for (let i = 0; i < 40; i++) view.zoomBy(1.5)
    settle(view)
    expect(view.spin.scale.x).toBeCloseTo(MAX_ZOOM, 2)
    for (let i = 0; i < 80; i++) view.zoomBy(0.5)
    settle(view)
    expect(view.spin.scale.x).toBeCloseTo(MIN_ZOOM, 2)

    view.rotate(new Vector3(1, 0, 0), 1)
    view.reset()
    settle(view)
    expect(view.spin.scale.x).toBeCloseTo(1, 3)
    expect(view.spin.quaternion.w).toBeCloseTo(1, 3)
  })

  it('geser sekitar 790 px ≈ satu putaran penuh', () => {
    expect(pixelsToRadians(785)).toBeCloseTo(Math.PI * 2, 1)
  })
})
