// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Simple Counter Contract
 * @notice A basic counter contract for comparison with FHECounter
 * @dev This is a traditional counter without encryption, used to demonstrate
 * the difference between plain and encrypted implementations
 */
contract Counter {
    uint32 private _count;

    event CountIncremented(uint32 newCount);
    event CountDecremented(uint32 newCount);

    /**
     * @notice Returns the current count
     * @dev Count is visible to everyone on-chain
     * @return The current count value
     */
    function getCount() external view returns (uint32) {
        return _count;
    }

    /**
     * @notice Increments the counter by a specific value
     * @dev Anyone can see the increment value and resulting count
     * @param value The amount to increment by
     */
    function increment(uint32 value) external {
        _count += value;
        emit CountIncremented(_count);
    }

    /**
     * @notice Decrements the counter by a specific value
     * @dev Includes underflow protection
     * @param value The amount to decrement by
     */
    function decrement(uint32 value) external {
        require(_count >= value, "Counter: cannot decrement below zero");
        _count -= value;
        emit CountDecremented(_count);
    }

    /**
     * @notice Resets the counter to zero
     */
    function reset() external {
        _count = 0;
    }
}
