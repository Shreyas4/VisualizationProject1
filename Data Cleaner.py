# import pandas as pd
# # sfoCrimesDF = pd.read_csv('SFOCrimeDataset.csv')
# # sfoCrimesDF = sfoCrimesDF.dropna()
# # sfoCrimesDF['Date'] = pd.to_datetime(sfoCrimesDF['Date'], format='%m/%d/%Y %H:%M').dt.date
# # sfoCrimesDF['Time'] = pd.to_datetime(sfoCrimesDF['Time'], format='%H:%M').dt.hour
# # sfoCrimesDF['DayOfMonth'] = sfoCrimesDF.apply(lambda row: row['Date'].day, axis=1)
# # sfoCrimesDF['MonthOfYear'] = sfoCrimesDF.apply(lambda row: row['Date'].month, axis=1)
# # sfoCrimesDF.to_csv('SFOCrimeDataCleaned.csv', index=False)
# # weaponlicenses = pd.read_csv('weapon licenses.csv')
# # weaponlicenses['MonthOfLicense'] = weaponlicenses.apply(lambda row: row['month'].day, axis=1)
# # print(weaponlicenses)
# # air_pollution = pd.read_csv('air_pollution.csv')
# # print(air_pollution.head())
# # indexNames = air_pollution[air_pollution['Date Local'] <= '2014-12-31'].index
# # indexNames2 = air_pollution[air_pollution['Date Local'] >= '2016-01-01'].index
# # Delete these row indexes from dataFrame
# # air_pollution.drop(indexNames, inplace=True)
# # air_pollution.drop(indexNames2, inplace=True)
# # air_pollution.fillna(0, inplace=True)
# # # print(air_pollution.isna().any())
# #
# # # air_pollution.to_csv('ReadyToMerge1.csv', index=False)
# #
# # airData = pd.read_csv('FinalReadySheet.csv')
# # popData = pd.read_csv('PopDataPerCounty.csv')
# # # print(airData.columns.values)
# # # print(airData.dtypes)
# # # print(popData.columns.values)
# # # print(popData.dtypes)
# # airData['State'] = airData['State'].astype(str)
# # popData['STNAME'] = popData['STNAME'].astype(str)
# # airData['County'] = airData['County'].astype(str)
# # popData['CTYNAME'] = popData['CTYNAME'].astype(str)
# # state_list = list(popData['STNAME'])
# # state_list = [s.lower().strip() for s in state_list]
# # cnt = 0
# # for airIndex, airRow in airData.iterrows():
# #     starting_index1 = state_list.index(airRow['State'].lower().strip())
# #     ending_index1 = starting_index1 + state_list.count(airRow['State'].lower().strip())
# #     compData = popData.iloc[starting_index1:ending_index1]
# #     county_list = list(compData['CTYNAME'])
# #     county_list = [s.lower().strip().split()[0] for s in county_list]
# #     try:
# #         starting_index2 = county_list.index(airRow['County'].lower().strip().split()[0])
# #         ending_index2 = starting_index2 + 19
# #         compData2 = compData.iloc[starting_index2:ending_index2]
# #         # print(starting_index1, ending_index1, ' - ', starting_index2, ending_index2, compData2.empty)
# #         if compData2.empty:
# #             print(compData, compData2)
# #             break
# #         airRow['TotalPop'] = compData.iloc[0]['TOT_POP']
# #         airRow['TotalPopMale'] = compData.iloc[0]['TOT_MALE']
# #         airRow['TotalPopFemale'] = compData.iloc[0]['TOT_FEMALE']
# #         airRow['Total0to30'] = compData.iloc[1]['TOT_POP'] + compData.iloc[2]['TOT_POP'] + compData.iloc[3]['TOT_POP'] + compData.iloc[4]['TOT_POP'] + compData.iloc[5]['TOT_POP'] + compData.iloc[6]['TOT_POP']
# #         airRow['Total0to30Male'] = compData.iloc[1]['TOT_MALE'] + compData.iloc[2]['TOT_MALE'] + compData.iloc[3]['TOT_MALE'] + compData.iloc[4]['TOT_MALE'] + compData.iloc[5]['TOT_MALE'] + compData.iloc[6]['TOT_MALE']
# #         airRow['Total0to30Female'] = compData.iloc[1]['TOT_FEMALE'] + compData.iloc[2]['TOT_FEMALE'] + compData.iloc[3]['TOT_FEMALE'] + compData.iloc[4]['TOT_FEMALE'] + compData.iloc[5]['TOT_FEMALE'] + compData.iloc[6]['TOT_FEMALE']
# #         airRow['Total30to60'] = compData.iloc[7]['TOT_POP'] + compData.iloc[8]['TOT_POP'] + compData.iloc[9]['TOT_POP'] + compData.iloc[10]['TOT_POP'] + compData.iloc[11]['TOT_POP'] + compData.iloc[12]['TOT_POP']
# #         airRow['Total30to60Male'] = compData.iloc[7]['TOT_MALE'] + compData.iloc[8]['TOT_MALE'] + compData.iloc[9]['TOT_MALE'] + compData.iloc[10]['TOT_MALE'] + compData.iloc[11]['TOT_MALE'] + compData.iloc[12]['TOT_MALE']
# #         airRow['Total30to60Female'] = compData.iloc[7]['TOT_FEMALE'] + compData.iloc[8]['TOT_FEMALE'] + compData.iloc[9]['TOT_FEMALE'] + compData.iloc[10]['TOT_FEMALE'] + compData.iloc[11]['TOT_FEMALE'] + compData.iloc[12]['TOT_FEMALE']
# #         airRow['TotalAbove60'] = compData.iloc[13]['TOT_POP'] + compData.iloc[14]['TOT_POP'] + compData.iloc[15]['TOT_POP'] + compData.iloc[16]['TOT_POP'] + compData.iloc[17]['TOT_POP'] + compData.iloc[18]['TOT_POP']
# #         airRow['TotalAbove60Male'] = compData.iloc[13]['TOT_MALE'] + compData.iloc[14]['TOT_MALE'] + compData.iloc[15]['TOT_MALE'] + compData.iloc[16]['TOT_MALE'] + compData.iloc[17]['TOT_MALE'] + compData.iloc[18]['TOT_MALE']
# #         airRow['TotalAbove60Female'] = compData.iloc[13]['TOT_FEMALE'] + compData.iloc[14]['TOT_FEMALE'] + compData.iloc[15]['TOT_FEMALE'] + compData.iloc[16]['TOT_FEMALE'] + compData.iloc[17]['TOT_FEMALE'] + compData.iloc[18]['TOT_FEMALE']
# #         airData.loc[airIndex] = airRow
# #         cnt+=1
# #         if cnt%50==0:
# #             print(cnt)
# #     except:
# #         continue
# # airData.dropna(inplace=True)
# # print(airData.isna().any())
# # print(cnt)
# # airData.to_csv('MergedSheet.csv', index=False)
#
# # data = pd.read_csv('FinalSheet.csv')
# # cData = pd.read_csv('Book1.csv')
# # data['State'] = data['State'].astype(str)
# # cData['County'] = cData['County'].astype(str)
# # data['State'] = data['State'].astype(str)
# # cData['County'] = cData['County'].astype(str)
# # state_list = list(cData['State'])
# # state_list = [s.lower().strip() for s in state_list]
# # data['PrematureDeaths'] = 0
# # data['AverageDailyParticulateMatter'] = 0.0
# # data['PhysicallyUnhealthyDays'] = 0.0
# # data['FairPoorHealthPercentage'] = 0
# # for index, row in data.iterrows():
# #     found = False
# #     for index2, row2 in cData.iterrows():
# #         if row['State'].lower().strip()==row2['State'].lower().strip() and row['County'].lower().strip().split()[0]==row2['County'].lower().strip().split()[0]:
# #             row['PrematureDeaths'] = row2['PremDeaths']
# #             row['AverageDailyParticulateMatter'] = row2['AvD PM']
# #             row['PhysicallyUnhealthyDays'] = row2['Physically Unhealthy days']
# #             row['FairPoorHealthPercentage'] = row2['FairPoorHealthPercentage']
# #             data.loc[index] = row
# #             found=True
# #             break
# #     if index%50==0:
# #         print(index)
# #     if not found:
# #         print(row['State'], row['County'])
# # data.to_csv('DataSheet.csv')
# # import numpy as np
# # air_poll_data = pd.read_csv('data_2000_2016.csv')
# #
# # states = list(air_poll_data['State'])
# # counties = list(air_poll_data['County'])
# # unique_states = list(air_poll_data['State'].unique())
# # state_counties_map = {}
# # for state in unique_states:
# #     counties_set = set()
# #     for i in range(len(states)):
# #         if states[i] == state:
# #             counties_set.add(counties[i])
# #     state_counties_map[state] = counties_set
# # new_df = pd.DataFrame(columns=[])
# # i=0
# # print('Started filling new data')
# # for state, county_set in state_counties_map.items():
# #     dataforState = air_poll_data[(air_poll_data['State']==state)]
# #     for county in county_set:
# #         dataframeForCounty = dataforState[(dataforState['County'] == county)]
# #         for year_no in range(2000, 2017):
# #             dataframeForYear = dataframeForCounty[(dataframeForCounty['Date Local']>=str(year_no)+"-01-01") & (dataframeForCounty['Date Local']<=str(year_no)+"-12-31")]
# #             if dataframeForYear.empty:
# #                 continue
# #             new_df.loc[i, 'State'] = state
# #             new_df.loc[i, 'County'] = county
# #             new_df.loc[i, 'Year'] = year_no
# #             new_df.loc[i, 'NO2_Units'] = dataframeForYear.iloc[0]['NO2 Units']
# #             new_df.loc[i, 'NO2_Mean'] = round(dataframeForYear['NO2 Mean'].mean(skipna=True), 2)
# #             new_df.loc[i, 'NO2_1st_Max_Value'] = round(dataframeForYear['NO2 1st Max Value'].mean(skipna=True), 2)
# #             new_df.loc[i, 'NO2_1st_Max_Hour'] = int(dataframeForYear['NO2 1st Max Hour'].mean(skipna=True))
# #             new_df.loc[i, 'NO2_AQI'] = round(dataframeForYear['NO2 AQI'].mean(skipna=True), 2)
# #             new_df.loc[i, 'O3_Units'] = dataframeForYear.iloc[0]['O3 Units']
# #             new_df.loc[i, 'O3_Mean'] = round(dataframeForYear['O3 Mean'].mean(skipna=True), 2)
# #             new_df.loc[i, 'O3_1st_Max_Value'] = round(dataframeForYear['O3 1st Max Value'].mean(skipna=True), 2)
# #             new_df.loc[i, 'O3_1st_Max_Hour'] = int(dataframeForYear['O3 1st Max Hour'].mean(skipna=True))
# #             new_df.loc[i, 'O3_AQI'] = round(dataframeForYear['O3 AQI'].mean(skipna=True), 2)
# #             new_df.loc[i, 'SO2_Units'] = dataframeForYear.iloc[0]['SO2 Units']
# #             new_df.loc[i, 'SO2_Mean'] = round(dataframeForYear['SO2 Mean'].mean(skipna=True), 2)
# #             new_df.loc[i, 'SO2_1st_Max_Value'] = round(dataframeForYear['SO2 1st Max Value'].mean(skipna=True), 2)
# #             new_df.loc[i, 'SO2_1st_Max_Hour'] = int(dataframeForYear['SO2 1st Max Hour'].mean(skipna=True))
# #             new_df.loc[i, 'SO2_AQI'] = round(dataframeForYear['SO2 AQI'].mean(skipna=True), 2)
# #             new_df.loc[i, 'CO_Units'] = dataframeForYear.iloc[0]['CO Units']
# #             new_df.loc[i, 'CO_Mean'] = round(dataframeForYear['CO Mean'].mean(skipna=True), 2)
# #             new_df.loc[i, 'CO_1st_Max_Value'] = round(dataframeForYear['CO 1st Max Value'].mean(skipna=True), 2)
# #             new_df.loc[i, 'CO_1st_Max_Hour'] = int(dataframeForYear['CO 1st Max Hour'].mean(skipna=True))
# #             new_df.loc[i, 'CO_AQI'] = round(dataframeForYear['CO AQI'].mean(skipna=True), 2)
# #             i+=1
# #             if i%100==0:
# #                 print(i, ' rows added')
# #
# # new_df.to_csv('finaldataset.csv')
# import random
# import pandas as pd
# airpollution = pd.read_csv('AirPollutionData.csv')
# years_dict = {
#     2010: pd.read_csv('2010.csv'),
#     2011: pd.read_csv('2011.csv'),
#     2012: pd.read_csv('2012.csv'),
#     2013: pd.read_csv('2013.csv'),
#     2014: pd.read_csv('2014.csv'),
#     2015: pd.read_csv('2015.csv'),
#     2016: pd.read_csv('2016.csv'),
# }
# airpollution['YPLL Rate'] = 0
# airpollution['% Fair/Poor'] = 0
# airpollution['Physically Unhealthy Days'] = 0.0
# for i, j in airpollution.iterrows():
#     year_df = years_dict[j['Year']]
#     comparable = year_df[year_df['State'] == j['State']]
#     for index, row in comparable.iterrows():
#
#         if type(row['County'])==str and row['County'].lower().strip()[0] == j['County'].lower().strip()[0]:
#             airpollution.loc[i, 'YPLL Rate'] = row['YPLL Rate']
#             airpollution.loc[i, '% Fair/Poor'] = row['% Fair/Poor']
#             airpollution.loc[i, 'Physically Unhealthy Days'] = row['Physically Unhealthy Days']
#             break
#
# airpollution['YPLL Rate'] = airpollution['YPLL Rate'].fillna(random.randint(5000, 7000))
# airpollution['% Fair/Poor'] = airpollution['% Fair/Poor'].fillna(random.randint(20, 30))
# airpollution['YPLL Rate'] = airpollution['YPLL Rate'].astype(int)
# airpollution['% Fair/Poor'] = airpollution['% Fair/Poor'].astype(int)
#
# airpollution['Physically Unhealthy Days'] = airpollution['Physically Unhealthy Days'].fillna(round(random.uniform(3, 8), 1))
# airpollution.to_csv('finaldataset.csv')
import pandas as pd
prePop = pd.read_csv('PreTemperature.csv')
popData = pd.read_csv('popData.csv')
prePop['TotalPop'] = 0
prePop['TotalMalePop'] = 0
prePop['TotalFemalePop'] = 0
for index, row in prePop.iterrows():
    comparable = popData[(popData['STNAME']==row['State']) & (popData['YEAR']==row['Year'])]
    for id, rw in comparable.iterrows():
        if type(row['County'])==str and row['County'].lower().strip()[0] == rw['CTYNAME'].lower().strip()[0]:
            prePop.loc[index, 'TotalPop'] = rw['TOT_POP']
            prePop.loc[index, 'TotalMalePop'] = rw['TOT_MALE']
            prePop.loc[index, 'TotalMalePop'] = rw['TOT_FEMALE']
            break
prePop.to_csv('MergedData.csv')