// Connect original questions and scenarios to the same rule as the corresponding contrast case.
// Each row corresponds to a group in contrast-bank.txt. Each entry lists IDs for one case.
const relatedIds = [
  [[32],[33,39],[30,51]],
  [[112],[113],[114]],
  [[115],[116],[120]],
  [[118],[117],[45,119]],
  [[110],[111],[36,142]],
  [[34,37],[40],[]],
  [[],[31,52],[]],
  [[41],[],[]],
  [[66,135],[49,137],[50,136]],
  [[48,146],[],[]],
  [[64,138],[63,139],[65,140]],
  [[57,143],[58,92],[59]],
  [[53,127,155],[122],[123,147]],
  [[68],[],[67,141]],
  [[56,145],[91],[]],
  [[44],[62,80],[]],
  [[70,149,150],[71,153,134],[72,151]],
  [[76],[54,81,148],[157]],
  [[],[77,156],[78]],
  [[42,79],[],[159]],
  [[82],[83],[84]],
  [[],[],[73,74,75,152,154]],
  [[121],[],[]],
  [[85,86,171],[43,87,169],[47,88,89,168]],
  [[93,167],[],[94,95]],
  [[107],[],[]],
  [[101],[103],[109]],
  [[105],[106],[]],
  [[96],[97],[98,99,170]],
  [[108],[102],[104]],
  [[100],[],[]],
  [[1,6],[7,9],[13]],
  [[2],[3,4,166],[]],
  [[8],[11],[10,12]],
  [[14],[15],[16]],
  [[],[],[5]],
  [[18,163],[22],[23]],
  [[19,26],[164],[20,21]],
  [[24],[25],[]],
  [[27,161,162],[28],[29]],
  [[125,158],[133],[]],
  [[128],[126],[129]],
  [[130],[131,160],[132]],
  [[17],[],[]],
  [[],[],[55,144]],
  [[69],[60],[61]],
  [[],[],[90]],
];

module.exports = function assignReviewFamilies(questions) {
  for (const [group, cases] of relatedIds.entries()) {
    for (const [caseIndex, ids] of cases.entries()) {
      for (const id of ids) {
        const question = questions[id - 1];
        if (question?.id !== id) throw Error(`Unknown review question ${id}`);
        question.family = `contrast-${group}-${caseIndex}`;
      }
    }
  }

  for (const [id, family] of [[315,'rail-queue'], [330,'blind-spot'], [432,'child-restraint']]) {
    if (!questions[id - 1]?.retired) throw Error(`Expected an archived matching question at ${id}`);
    questions[id - 1].reviewFamily = family;
  }
  const focusedFamilies = {
    54:'blind-spot', 81:'blind-spot', 148:'blind-spot', 98:'child-restraint', 99:'child-restraint', 170:'child-restraint',
    66:'red-light', 135:'red-light', 72:'forward-scan', 151:'forward-scan', 293:'headlight-flash',
    85:'blowout', 86:'blowout', 171:'blowout', 379:'blowout', 106:'jack', 418:'jack',
  };
  for (const [id, family] of Object.entries(focusedFamilies)) questions[id - 1].reviewFamily = family;
};
