import { StyleSheet } from 'react-native';
import Helper from '@~/helpers/index';

export default StyleSheet.create({
  container: {
    height: Helper.normalizeSize(1020),
    backgroundColor: 'white',
  },
  titleContainer: {
    paddingLeft: Helper.normalizeSize(28),
    paddingTop: Helper.normalizeSize(28),
    marginBottom: Helper.normalizeSize(76),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: Helper.normalizeText(16),
  },
  titleIcon: {
    paddingRight: Helper.normalizeSize(26),
  },
  headerContainer: {
    flexDirection: 'row',
    paddingLeft: Helper.normalizeSize(40),
    justifyContent: 'flex-start',
    marginBottom: Helper.normalizeSize(35),
  },
  headerText: {
    fontSize: Helper.normalizeText(14),
    marginRight: Helper.normalizeSize(60),
    paddingBottom: Helper.normalizeSize(12),
  },
  headerTextSelect: {
    fontWeight: 'bold',
    fontSize: Helper.normalizeText(14),
    marginRight: Helper.normalizeSize(60),
    paddingBottom: Helper.normalizeSize(12),
    borderBottomColor: '#235AAE',
    borderBottomWidth: Helper.normalizeSize(4),
    borderRadius: Helper.normalizeSize(4),
  },
  content: {
    paddingLeft: Helper.normalizeSize(40),
  },
  contentText: {
    fontSize: Helper.normalizeText(14),
    paddingVertical: Helper.normalizeSize(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
