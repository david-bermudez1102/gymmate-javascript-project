class Trainer < ApplicationRecord
  has_one :account, as: :userable, dependent: :destroy
  has_many :programs

  def self.accounts
    self.all.map do |trainer|
      trainer.account
    end
  end
end
