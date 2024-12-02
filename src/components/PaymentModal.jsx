import { useState } from "react";
import { ethers } from "ethers";

function PaymentModal(props) {
  let [amount, setAmount] = useState(1);

  // Close modal function
  function closeModal() {
    props.setModalShow(false);
  }

  // Handle input change
  function handleChange(e) {
    setAmount(e.target.value);
  }

  // Send funds to the smart contract
  async function sendFund() {
    if (amount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }
    try {
      let fund = { value: ethers.utils.parseEther(amount.toString()) };
      let txn = await props.contract.fundProject(props.index, fund);
      await txn.wait();
      alert(`${amount} Sepolia successfully funded.`);
      setAmount(1);
      closeModal();
    } catch (error) {
      console.error("Funding error: ", error);
      alert("Error sending Sepolia.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h1 className="text-xl font-bold text-gray-800">Payment</h1>
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">
          <label
            htmlFor="payment"
            className="block text-sm font-medium text-gray-600"
          >
            Amount (Sepolia)
          </label>
          <input
            type="number"
            id="payment"
            name="payment"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Sepolia amount"
            min="1"
            step="1"
            value={amount}
            onChange={handleChange}
            required
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={sendFund}
          >
            Fund
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
