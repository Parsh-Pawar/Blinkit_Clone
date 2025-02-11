import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Fragment, useEffect, useRef } from 'react'
import { colors, fontFamily, isAndroid, sizes } from '../utils/Theme'
import { changeNavigationColor } from '../utils/Helper'
import NoticeAnimation from '../components/dashboard/NoticeAnimation'
import CustomSafeAreaView from '../components/common/CustomSafeAreaView'
import Visuals from '../components/dashboard/Visuals'
import { CollapsibleContainer, CollapsibleHeaderContainer, CollapsibleScrollView, useCollapsibleContext, withCollapsibleContext } from '@r0b0t3d/react-native-collapsible'
import AnimatedHeader from '../components/dashboard/AnimatedHeader'
import StickySearchBar from '../components/dashboard/StickySearchBar'
import Content from '../components/dashboard/Content'
import CustomText from '../components/common/CustomText'
import { RFValue } from 'react-native-responsive-fontsize'
import Reanimated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import CartSummary from '../components/common/CartSummary'

const ProductDashboardScreen = () => {


    const NoticeAnimationRef = useRef()

    const { scrollY, expand } = useCollapsibleContext()
    const previousScroll = useRef(0)
    const backToTopStyle = useAnimatedStyle(() => {
        const isScrollingUp = scrollY.value < previousScroll.current && scrollY.value > 180
        const opacity = withTiming(isScrollingUp ? 1 : 0, { duration: 300 })
        const translateY = withTiming(isScrollingUp ? 0 : 10, { duration: 300 })
        previousScroll.current = scrollY.value
        return {
            opacity,
            transform: [{ translateY }]
        }
    })


    function scrollToTop() {
        scrollY.value = 0
        expand()
    }

    function showNotice() {
        if (NoticeAnimationRef?.current?.showNotice) {
            NoticeAnimationRef?.current?.showNotice()
        }
    }


    useEffect(() => {
        setTimeout(() => {
            changeNavigationColor(colors.white)
        }, 10);
    }, [])


    return (
        <Fragment>
            <NoticeAnimation NoticeAnimationRef={NoticeAnimationRef}>
                <View style={styles.panelContainer}>

                    <Visuals />

                    <Reanimated.View style={[styles.backToTopParentView, backToTopStyle]}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { scrollToTop() }}
                            style={styles.backToTopView}
                        >
                            <Ionicons name="arrow-up-circle-outline" size={18} color={colors.white} />
                            <CustomText fontSize={12} fontFamily={fontFamily.medium} color={colors.white}>
                                Back to top
                            </CustomText>
                        </TouchableOpacity>
                    </Reanimated.View>

                    <CustomSafeAreaView>
                        <View style={styles.panelContainer}>
                            <CollapsibleContainer style={styles.panelContainer}>

                                <CollapsibleHeaderContainer containerStyle={styles.transparent}>
                                    <AnimatedHeader showNotice={showNotice} />
                                    <StickySearchBar />
                                </CollapsibleHeaderContainer>

                                <CollapsibleScrollView
                                    nestedScrollEnabled
                                    style={styles.panelContainer}
                                    contentContainerStyle={styles.flexGrowView}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Content />

                                    <View style={styles.footerView}>
                                        <View>
                                            <View style={styles.footerTitleContainer}>
                                                <CustomText fontSize={46} fontFamily={fontFamily.bold} style={styles.footerTitleText}>
                                                    India's last minute app
                                                </CustomText>
                                                <CustomText fontSize={32} style={styles.heart}>
                                                    ❤️
                                                </CustomText>
                                            </View>
                                        </View>
                                        <CustomText fontSize={16} fontFamily={fontFamily.bold} style={styles.footerSubTitleText}>
                                            Developed by ❤️ Abbas Khan
                                        </CustomText>
                                    </View>
                                </CollapsibleScrollView>
                            </CollapsibleContainer>
                        </View>
                    </CustomSafeAreaView>
                </View>
            </NoticeAnimation>
            <CartSummary />
        </Fragment>
    )
}

export default withCollapsibleContext(ProductDashboardScreen)

const styles = StyleSheet.create({
    flexGrowView: {
        flexGrow: 1,
    },
    panelContainer: {
        flex: 1
    },
    transparent: {
        backgroundColor: colors.transparent,
    },
    footerView: {
        flex: 1,
        padding: 20,
        paddingTop: 30,
        backgroundColor: colors.white,
    },
    footerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingRight: 2
    },
    footerTitleText: {
        opacity: 0.25,
        lineHeight: RFValue(48),
        letterSpacing: -0.3,
    },
    footerSubTitleText: {
        opacity: 0.25,
        marginTop: 50,
        paddingBottom: 100
    },
    heart: {
        top: -2
    },
    backToTopParentView: {
        position: "absolute",
        alignSelf: 'center',
        top: isAndroid ? 100 : sizes.height * 0.18,
        backgroundColor: colors.background7,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 9,
        zIndex: 999
    },
    backToTopView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    }
})