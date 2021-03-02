interface ByUid { uid: string }

export const createQr = ({ link }: { link: string } = { link: "" }) => `/api/qr${link ? `?link=${link}` : ""}`;
export const getQrImage = ({ uid }: ByUid = { uid: ":uid" }) => `/api/qr/${uid}/image`;
export const useQr = ({ uid }: ByUid = { uid: ":uid" }) => `/api/qr/${uid}/use`;
export const page404 = () => `/404`;
export const all = () => "*";
