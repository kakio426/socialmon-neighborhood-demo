export const lesson = Object.freeze({
  id: 'socialmon-3-1-u1-g02-helpful-places',
  title: '우리 동네를 부탁해!',
  edition: '2차시 탐사대',
  minutes: '약 8~12분',
  screens: ['town', 'requests', 'research', 'improve', 'quiz'],
  objectives: [
    '생활을 돕는 장소와 하는 일을 알아봐요.',
    '직접 살펴보고 사람의 이야기를 듣는 조사 방법을 알아봐요.',
    '동네의 좋은 점과 불편한 점을 살펴보고 해결 방법을 생각해요.'
  ],
  places: [
    {id:'library', name:'도서관', label:'책과 자료를 살펴보는 곳', detail:'도서관은 책을 읽고 자료를 찾는 곳이에요.', fact:'어린이자료실에는 어린이들이 편하게 책을 읽을 수 있는 공간이 있어요.'},
    {id:'post', name:'우체국', label:'편지와 소식을 전하는 곳', detail:'우체국은 편지와 소포를 보내는 곳이에요.', fact:'우체국은 사람들의 소식과 물건을 전하는 데 도움을 줘요.'},
    {id:'park', name:'공원', label:'함께 쉬고 놀이하는 곳', detail:'공원은 산책하고 쉬거나 노는 곳이에요.', fact:'공원을 이용하는 여러 사람의 생각을 살피면 더 편리한 곳을 만들 수 있어요.'}
  ],
  requests: [
    {id:'resident', name:'동네 어른', role:'산책하는 주민', text:'나무가 많아 공원이 참 좋아요. 그런데 길가에 쓰레기가 있으면 걷기가 불편해요.'},
    {id:'friend', name:'우체국 직원', role:'동네를 오가는 주민', text:'편지를 전할 때 공원을 지나가요. 깨끗한 길이면 모두가 더 편하게 다닐 수 있어요.'},
    {id:'family', name:'아이와 보호자', role:'공원을 이용하는 가족', text:'가족과 산책할 수 있어 좋아요. 쓰레기를 줄이면 모두가 더 편하게 쉴 수 있겠어요.'}
  ],
  evidence: [
    {id:'seen', title:'공원에서 살펴보기', verb:'그림에서 살펴본 것', body:'공원에는 나무와 쉴 자리가 있어요. 산책로 옆에는 버려진 쓰레기가 보여요.', note:'그림 속 장소의 모습을 살펴본 내용이에요.'},
    {id:'heard', title:'주민에게 물어보기', verb:'들은 것', body:'“공원에서 산책하는 것이 좋아요. 쓰레기가 줄어들면 더 좋겠어요.”', note:'주민에게 질문하고 들은 이야기예요.'},
    {id:'guide', title:'조사 방법 자료', verb:'교과서에서 찾은 것', body:'동네의 장소를 직접 찾아가거나 그곳을 잘 아는 사람에게 물어보며 조사할 수 있어요.', note:'그림에서 아이들이 어떤 방법으로 조사하는지 살펴봐요.'}
  ],
  improvements: [
    {id:'cleanup', title:'함께 공원 가꾸기', text:'함께 줍고 이용 약속을 만들어요.', valid:true, feedback:'주민이 함께 할 수 있는 방법이에요. 이용하는 사람들에게 약속을 알릴 수도 있어요.'},
    {id:'ask', title:'도움을 요청하기', text:'주민과 담당자에게 방법을 물어요.', valid:true, feedback:'여러 사람의 의견을 모아 담당자와 의논하는 방법이에요.'},
    {id:'ignore', title:'그대로 지나가기', text:'불편해도 아무것도 하지 않아요.', valid:false, feedback:'문제를 함께 해결하려면 먼저 상황을 살피고 의견을 나누는 것이 필요해요.'}
  ],
  quiz: [
    {id:'place-role', prompt:'책과 자료를 살펴볼 수 있는 곳은?', options:[{id:'post',text:'우체국'},{id:'library',text:'도서관'},{id:'fire',text:'소방서'}], correct:'library', explanation:'도서관에서는 여러 책과 자료를 이용할 수 있어요.'},
    {id:'seen-heard', prompt:'주민에게 물어보고 들은 내용은?', options:[{id:'saw',text:'공원 길가에 종이컵을 보았어요.'},{id:'heard',text:'주민이 주말에 자주 온다고 했어요.'},{id:'plan',text:'다음에 공원을 다시 살펴볼 거예요.'}], correct:'heard', explanation:'주민이 말씀하신 내용은 물어보고 들은 내용이에요.'},
    {id:'solve', prompt:'동네의 불편한 점을 발견했을 때 먼저 어떻게 하면 좋을까요?', options:[{id:'decide-alone',text:'다른 사람의 말은 듣지 않아요.'},{id:'skip',text:'불편해도 그냥 지나가요.'},{id:'investigate',text:'살펴보고 여러 사람에게 물어봐요.'}], correct:'investigate', explanation:'상황을 살펴보고 여러 사람의 의견을 들어야 알맞은 해결 방법을 생각할 수 있어요.'}
  ],
  source: {
    title:'국립어린이청소년도서관 어린이자료실 안내',
    url:'https://www.nlcy.go.kr/NLCY/contents/C50301000000.do',
    note:'어린이자료실에 아이들이 책을 읽을 수 있는 공간이 있음을 확인했어요.'
  }
});
