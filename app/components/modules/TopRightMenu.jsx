import React from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import Icon from 'app/components/elements/Icon';
import user from 'app/redux/User';
import Userpic from 'app/components/elements/Userpic';
import { browserHistory } from 'react-router';
import { LinkWithDropdown } from 'react-foundation-components/lib/global/dropdown';
import VerticalMenu from 'app/components/elements/VerticalMenu';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import NotifiCounter from 'app/components/elements/NotifiCounter';

const defaultNavigate = (e) => {
    if (e.metaKey || e.ctrlKey) {
        // prevent breaking anchor tags
    } else {
        e.preventDefault();
    }
    const a = e.target.nodeName.toLowerCase() === 'a' ? e.target : e.target.parentNode;
    browserHistory.push(a.pathname + a.search + a.hash);
};

function TopRightMenu({username, showLogin, logout, loggedIn, vertical, navigate, toggleOffCanvasMenu, probablyLoggedIn}) {
    const mcn = 'menu' + (vertical ? ' vertical show-for-small-only' : '');
    const mcl = vertical ? '' : ' sub-menu';
    const lcn = vertical ? '' : 'show-for-medium';
    const nav = navigate || defaultNavigate;
    const submit_story = $STM_Config.read_only_mode ? null : <li className={lcn + ' submit-story' + (vertical ? ' last' : '')}><a href="/submit.html" onClick={nav}>Submit a Story</a></li>;
    const submit_icon = $STM_Config.read_only_mode ? null : <li className="show-for-small-only"><Link to="/submit.html"><Icon name="pencil2" /></Link></li>;
    const feed_link = `/@${username}/feed`;
    const replies_link = `/@${username}/recent-replies`;
    const wallet_link = `/@${username}/transfers`;
    const account_link = `/@${username}`;
    const comments_link = `/@${username}/comments`;
    const reset_password_link = `/@${username}/password`;
    const settings_link = `/@${username}/settings`;
    if (loggedIn) { // change back to if(username) after bug fix:  Clicking on Login does not cause drop-down to close #TEMP!
        const user_menu = [
            {link: feed_link, icon: "home", value: 'Feed', addon: <NotifiCounter fields="feed" />},
            {link: account_link, icon: 'profile', value: 'Blog'},
            {link: comments_link, icon: 'replies', value: 'Comments'},
            {link: replies_link, icon: 'reply', value: 'Replies', addon: <NotifiCounter fields="comment_reply" />},
            {link: wallet_link, icon: 'wallet', value: 'Wallet', addon: <NotifiCounter fields="follow,send,receive,account_update" />},
            {link: reset_password_link, icon: 'key', value: 'Change Password'},
            {link: settings_link, icon: 'cog', value: 'Settings'},
            loggedIn ?
            {link: '#', icon: 'enter', onClick: logout, value: 'Logout'} :
            {link: '#', onClick: showLogin, value: 'Login'}
        ];
        return (
            <ul className={mcn + mcl}>
                <li className={lcn + " Header__search"}><a href="/static/search.html" title="Search">{vertical ? <span>Search</span> : <Icon name="search" />}</a></li>
                {submit_story}
                {!vertical && submit_icon}
                <LinkWithDropdown
                    closeOnClickOutside
                    dropdownPosition="bottom"
                    dropdownAlignment="right"
                    dropdownContent={
                        <VerticalMenu items={user_menu} title={username} />
                    }
                >
                    {!vertical && <li className={'Header__userpic '}>
                        <a href={account_link} title={username} onClick={e => e.preventDefault()}>
                            <Userpic account={username} />
                        </a>
                        <div className="TopRightMenu__notificounter"><NotifiCounter fields="total" /></div>
                    </li>}
                </LinkWithDropdown>
                {toggleOffCanvasMenu && <li className="toggle-menu Header__hamburger"><a href="#" onClick={toggleOffCanvasMenu}>
                    <span className="hamburger" />
                </a></li>}
            </ul>
        );
    }
    if (probablyLoggedIn) {
        return (
            <ul className={mcn + mcl}>
                {!vertical && <li className="Header__search"><a href="/static/search.html" title="Search"><Icon name="search" /></a></li>}
                <li className={lcn} style={{paddingTop: 0, paddingBottom: 0}}><LoadingIndicator type="circle" inline /></li>
                {toggleOffCanvasMenu && <li className="toggle-menu Header__hamburger"><a href="#" onClick={toggleOffCanvasMenu}>
                    <span className="hamburger" />
                </a></li>}
            </ul>
        );
    }
    return (
        <ul className={mcn + mcl}>
            {!vertical && <li className="Header__search"><a href="/static/search.html" title="Search"><Icon name="search" /></a></li>}
            <li className={lcn}><a href="/pick_account">Sign Up</a></li>
            <li className={lcn}><a href="/login.html" onClick={showLogin}>Login</a></li>
            {submit_story}
            {!vertical && submit_icon}
            {toggleOffCanvasMenu && <li className="toggle-menu Header__hamburger"><a href="#" onClick={toggleOffCanvasMenu}>
                <span className="hamburger" />
            </a></li>}
        </ul>
    );
}

TopRightMenu.propTypes = {
    username: React.PropTypes.string,
    loggedIn: React.PropTypes.bool,
    probablyLoggedIn: React.PropTypes.bool,
    showLogin: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
    vertical: React.PropTypes.bool,
    navigate: React.PropTypes.func,
    toggleOffCanvasMenu: React.PropTypes.func
};

export default connect(
    state => {
        if (!process.env.BROWSER) {
            return {
                username: null,
                loggedIn: false,
                probablyLoggedIn: !!state.offchain.get('account')
            }
        }
        const username = state.user.getIn(['current', 'username']);
        const loggedIn = !!username;
        return {
            username,
            loggedIn,
            probablyLoggedIn: false
        }
    },
    dispatch => ({
        showLogin: e => {
            if (e) e.preventDefault();
            dispatch(user.actions.showLogin())
        },
        logout: e => {
            if (e) e.preventDefault();
            dispatch(user.actions.logout())
        }
    })
)(TopRightMenu);
