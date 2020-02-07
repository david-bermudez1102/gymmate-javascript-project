class Trainer < ApplicationRecord
  has_one :account, as: :userable, dependent: :destroy
  has_many :programs, :dependent => :delete_all 

  def self.accounts
    self.all.map do |trainer|
      trainer.account
    end
  end

  def self.search(query)
    joins(:account).where('name LIKE ?', "%#{query}%")
  end
end
