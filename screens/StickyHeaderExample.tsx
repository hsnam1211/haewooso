import React from 'react';
import { View, SectionList, Text, Pressable, Platform } from 'react-native';
import SvgIcon from '../src/components/SvgIcon';
import { taptic } from '../src/util/taptic';


const data = [
  { title: 'pass', data: [{ id: '1', description: '안녕핫용' }] },
  {
    title: 'Header', data: [{ id: '11', title: '로또 번호 좀여', description: '로또 번호 좀 알려주세여~' },
    { id: '2', title: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '3', title: 'asdasd', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '4', title: '벌써 4시다.. ', description: '얼른 자야하는데...' },
    { id: '5', title: '넘 힘들다!', description: 'ㅜㅜ' },
    { id: '6', title: '일찍 자는 방법', description: '빨리 자야하는데' },
    { id: '7', title: '유튜브', description: '유튜브 조회수가 너무 안나와.. 잘 되는 방법 좀 ㅋㅋ' },
    { id: '8', title: 'Item 3' },
    { id: '9', title: 'Item 4' },
    { id: '10', title: 'Item 5' }]
  },
];


const renderSectionHeader = ({ section }) => {
  if (section.title !== 'pass') {
    return (<View>
      <View style={{
        paddingLeft: 16,
      }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{}}>
            <SvgIcon
              name='haewoosoLogo'
              fill='#000000'
              stroke='#797979'
              strokeWidth='1.5'
              size={40}
            />
          </View>
          <Text
            style={{
              paddingLeft: 10,
              color: '#413d34',
              fontSize: 26,
              textAlign: 'left',
              fontWeight: 'bold',
              // marginBottom: 8,
              top: Platform.OS === 'ios' ? 9 : 0,

            }}
          >
            해우소
          </Text>
          <Text
            style={{
              color: '#413d34',
              fontSize: 26,
              textAlign: 'left',
              fontWeight: 'bold',
              marginBottom: 8,
              top: Platform.OS === 'ios' ? 7 : 0,

            }}
          >
            입니다.
          </Text>
        </View>
      </View>
    </View>)

  } else {
    return <></>
  }
}

const renderItem = ({ item }) => {
  console.log(item.id)
  if (item.id !== '1') {
    return (<View style={{ padding: 10, backgroundColor: '#F5F5F5' }}>
      <Text>{item.description}</Text>
    </View>)
  } else {
    return (
      <View style={{
        paddingLeft: 16,
        marginTop: 20,
      }}
      >
        <Text
          style={{
            color: '#413d34',
            fontSize: 22,
            // opacity: opacity,
            textAlign: 'left',
            marginBottom: 16,
          }}
        >
          안녕하세요.
        </Text>
        <Text
          style={{
            color: '#413d34',
            fontSize: 26,
            textAlign: 'left',
            fontWeight: 'bold',
            marginBottom: 8,
            // opacity: opacity,
          }}
        >
          당신의 근심 해소공간
        </Text>
      </View>)
  }
}

const StickyHeaderExample = () => {
  return (
    <SectionList
      sections={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id + item.description}
      stickySectionHeadersEnabled={true} // Sticky Header 활성화
      renderSectionHeader={renderSectionHeader} // 섹션 헤더 렌더링
    />
  );
};

export default StickyHeaderExample;
