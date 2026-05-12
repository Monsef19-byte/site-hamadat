import { useRef, useCallback, useEffect } from 'react';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function useTilt() {
  const innerRef = useRef<HTMLDivElement>(null);
  const s = useRef({
    rotX: { c: 0, t: 0 }, rotY: { c: 0, t: 0 },
    bgX:  { c: 0, t: 0 }, bgY:  { c: 0, t: 0 },
    amt: 0.06, raf: 0,
  });

  useEffect(() => {
    const tick = () => {
      const st = s.current;
      const el = innerRef.current;
      st.rotX.c = lerp(st.rotX.c, st.rotX.t, st.amt);
      st.rotY.c = lerp(st.rotY.c, st.rotY.t, st.amt);
      st.bgX.c  = lerp(st.bgX.c,  st.bgX.t,  st.amt);
      st.bgY.c  = lerp(st.bgY.c,  st.bgY.t,  st.amt);
      if (el) {
        el.style.setProperty('--rotX',   st.rotX.c.toFixed(2) + 'deg');
        el.style.setProperty('--rotY',   st.rotY.c.toFixed(2) + 'deg');
        el.style.setProperty('--bgPosX', st.bgX.c.toFixed(2)  + '%');
        el.style.setProperty('--bgPosY', st.bgY.c.toFixed(2)  + '%');
      }
      st.raf = requestAnimationFrame(tick);
    };
    s.current.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.current.raf);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const st = s.current;
    st.amt = 0.1;
    const el = e.currentTarget as HTMLElement;
    const ox = (e.nativeEvent.offsetX - el.clientWidth  * 0.5) / (Math.PI * 3);
    const oy = -(e.nativeEvent.offsetY - el.clientHeight * 0.5) / (Math.PI * 4);
    st.rotY.t = ox;   st.rotX.t = oy;
    st.bgX.t  = -ox * 0.3;   st.bgY.t = oy * 0.3;
  }, []);

  const onMouseLeave = useCallback(() => {
    const st = s.current;
    st.amt = 0.06;
    st.rotX.t = 0; st.rotY.t = 0;
    st.bgX.t  = 0; st.bgY.t  = 0;
  }, []);

  return { innerRef, onMouseMove, onMouseLeave };
}
