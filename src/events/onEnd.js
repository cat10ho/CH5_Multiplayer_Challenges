import { getUser, removeUser } from '../session/user.session.js';

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');
  removeUser(socket);
   console.log("현재 접속중인 유저",getUser());
};