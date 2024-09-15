import { isPushState } from "../recoil/atoms";
import { useRecoilState } from "recoil";

export default function usePush() {
  const [isPush, setIsPush] = useRecoilState(isPushState);

  const updatePushState = async state => {
    alert(`${state}를 서버로 보냄`);
  };

  return { isPush, setIsPush, updatePushState };
}
