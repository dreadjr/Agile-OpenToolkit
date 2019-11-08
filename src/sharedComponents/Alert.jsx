import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { Error } from 'styled-icons/boxicons-solid/Error';
import { Bell } from 'styled-icons/boxicons-solid/Bell';
import { Check } from 'styled-icons/boxicons-regular/Check';
import { Cross } from 'styled-icons/icomoon/Cross';

const Wrapper = styled.div`
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    top: 50px;
    left: 0;
    right: 0;
    z-index: 10000;
    width: fit-content;
    background-color: #ffffff;
    -webkit-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
    box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.15);
`

const Content = styled.div`
    display: flex;
    position: relative;
`

const Exit = styled.div`
    position: absolute;
    right: 5px;
    top 5px;
`

const Toast = styled.div`

`

const Icon = styled.div`
    color: #ffffff;
    height: 100px;
    width: 100px;
    background-color: ${props => props.color};
`

const AlertContent = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 200px;
    padding: 10px;
`

const Type = styled.div`
    display: flex;
    justify-content: center;

`

const Message = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
`


const Alert = ({alert, removeToast}) => {
    let IconComponent;
    let color = "#0a60ff";

    if(alert.type) {
        if(alert.type == "alert-danger") {
            IconComponent = <Error />
            color = "#d21e36"             
        } else if(alert.type == "alert-success") {
            IconComponent = <Check />
            color = "#249b34"
        } else if(alert.type == "alert-info") {
            IconComponent = <Bell />
        }
    }

    return (
        <Wrapper>
            <Content>
                <Exit onClick={(e) => {removeToast()}}>
                    <Cross size="1em" />
                </Exit>
                <Icon color={color}>
                    {IconComponent}
                </Icon>
                <AlertContent>
                    <Type>
                        <b>{alert.type && <Toast>{typeof alert.type === 'object' ? "" : alert.type}</Toast>}</b>
                    </Type>
                    <Message>
                        {alert.message && <Toast>{typeof alert.message === 'object' ? "" : alert.message}</Toast>}
                    </Message>
                </AlertContent>
            </Content>
        </Wrapper>
    )
}

Alert.proptypes = {
    alert: PropTypes.object.isRequired,
    removeToast: PropTypes.func.isRequired
}

export default Alert;