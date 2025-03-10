import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, fontFamily, isAndroid } from '../../utils/Theme'
import CustomText from '../common/CustomText'
import Geolocation from '@react-native-community/geolocation'
import axios from 'axios'
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize'
import { navigate } from '../../utils/NavigationUtil'
import { storage, tokenStorage } from '../../state/storage'
import { useLocationStore } from '../../state/LocationStore'

const Header = ({ showNotice = () => { } }) => {


    const [locationName, setLocationName] = useState("Loading...")
    const [disabled, setDisabled] = useState(false)
    const { setFullLocationName } = useLocationStore()


    async function getLocationName() {
        try {
            Geolocation.getCurrentPosition(async (info) => {
                const latitude = info?.coords?.latitude
                const longitude = info?.coords?.longitude
                if (latitude && longitude) {
                    await axios.get(`https://nominatim.spaarksweb.com/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`, { headers: { "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8" } })
                        .then(async (resp) => {
                            if (resp?.data?.display_name) {
                                setFullLocationName(resp?.data?.display_name)
                                let display_name = resp?.data?.display_name?.split(", ")
                                if (display_name?.length) {
                                    display_name = display_name?.length > 1 ? `${display_name[0]}, ${display_name[1]}` : (display_name[0] || "")
                                    if (display_name) {
                                        setLocationName(display_name)
                                    }
                                }
                            }
                        })
                        .catch(async (err) => {
                            console.error("🚀 ~ file: Header.js:23 ~ Geolocation.getCurrentPosition ~ err:", err)
                        })
                }
            })
        } catch (error) {
            console.error("🚀 ~ file: Header.js:40 ~ getLocationName ~ error:", error)
        }
    }

    function onPress() {
        setDisabled(true)
        showNotice()
        setTimeout(() => {
            setDisabled(false)
        }, 5400);
    }

    function onProfilePress(params) {
        const phone = tokenStorage.getString("phoneNumber")
        if (phone) {
            navigate("ProfileScreen")
        } else {
            navigate("CustomerLoginScreen", { isFromProfile: true })
        }
    }


    useEffect(() => {
        getLocationName()
        setTimeout(() => {
            onPress()
        }, 1000);
    }, [])


    return (
        <View style={styles.subContainer}>
            <TouchableOpacity
                disabled={disabled}
                onPress={onPress}
                activeOpacity={0.8}
                style={styles.flexView}
            >
                <CustomText fontSize={12} fontFamily={fontFamily.bold} color={colors.white}>
                    Delivery in
                </CustomText>

                <View style={styles.flexRowGap}>
                    <CustomText fontSize={26} fontFamily={fontFamily.semiBold} color={colors.white} >
                        10 minutes
                    </CustomText>

                    {!disabled ?
                        <TouchableOpacity
                            disabled={disabled}
                            onPress={onPress}
                            style={styles.noticeBtn}
                        >
                            <CustomText fontSize={11} fontFamily={fontFamily.medium} color={colors.darkBlue2} >
                                🌧️ Rain
                            </CustomText>
                        </TouchableOpacity>
                        : null
                    }
                </View>

                <View style={styles.locationView}>
                    <CustomText fontSize={15} color={colors.white} numberOfLines={1}>
                        {locationName}
                    </CustomText>
                    <AntDesign name="caretdown" size={10} color={colors.white} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => { onProfilePress() }}
                activeOpacity={1}
                hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
            >
                <MaterialCommunityIcons name="account-circle-outline" size={RFValue(36)} color={colors.white} />
            </TouchableOpacity>

        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    locationView: {
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        width: '72%',
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: isAndroid ? 2 : 5,
        paddingBottom: 14,
        justifyContent: 'space-between',
    },
    flexRowGap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: -4
    },
    noticeBtn: {
        backgroundColor: colors.background3,
        borderRadius: 30,
        paddingHorizontal: 5,
        paddingVertical: 2,
        bottom: -2
    },
    flexView: {
        flex: 1
    }
})