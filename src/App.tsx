import {
  useCallback,
  useState,
  useRef,
  MouseEvent as ReactMouseEvent,
} from "react";
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import RotateIcon from "@mui/icons-material/RotateLeft";
import "./App.css";

function App() {
  const [angle, setAngle] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const startAngleRef = useRef<number>(0);
  const prevAngleRef = useRef<number>(0);

  const onRotateStart = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      console.log("rotate start");
      if (!isRotating && imgRef.current) {
        e.preventDefault();

        const clientRect = imgRef.current.getBoundingClientRect();

        const centerX = clientRect.left + clientRect.width / 2;
        const centerY = clientRect.top + clientRect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        startAngleRef.current = (180 / Math.PI) * Math.atan2(dy, dx);
        prevAngleRef.current = angle;

        setIsRotating(true);
      }
    },
    [angle, isRotating],
  );

  const onRotateEnd = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsRotating(false);
    console.log("rotate end");
  }, []);

  const handleBoxMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isRotating && imgRef.current) {
        const clientRect = imgRef.current.getBoundingClientRect();

        const centerX = clientRect.left + clientRect.width / 2;
        const centerY = clientRect.top + clientRect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        const dAngle = (180 / Math.PI) * Math.atan2(dy, dx);

        const rotatedAngle = dAngle - startAngleRef.current;

        setAngle(prevAngleRef.current + rotatedAngle);
      }
    },
    [angle, isRotating],
  );

  return (
    <Box className="App" width="100%" height="100%">
      <Box
        component="div"
        width={400}
        height={400}
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        css={css({ transform: `rotate(${angle}deg)` })}
      >
        <IconButton
          color="primary"
          onMouseDown={onRotateStart}
          onMouseMove={handleBoxMouseDown}
          onMouseUp={onRotateEnd}
        >
          <RotateIcon />
        </IconButton>
        <img
          ref={imgRef}
          src="https://i.imgur.com/lpr9cr7.jpeg"
          width="100%"
          height="100%"
        />
      </Box>
    </Box>
  );
}

export default App;
